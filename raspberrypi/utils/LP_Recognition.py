import numpy as np
import tflite_runtime.interpreter as tflite

class LP_Detection:
  # When initial, create tflite interpreter then allocate tensor
  def __init__(self, model_path, image_size) -> None:
    self.image_size = image_size

    self.interpreter = tflite.Interpreter(model_path = model_path)
    self.input_details = self.interpreter.get_input_details()
    self.output_details = self.interpreter.get_output_details()
    self.interpreter.allocate_tensors()

  def detect(self, image, score_threshold):
    self.interpreter.set_tensor(self.input_details[0]['index'], image[np.newaxis])
    self.interpreter.invoke()

    # Check if score pass threshold, if not then drop it
    score = round(self.interpreter.get_tensor(self.output_details[0]['index'])[0][0], 2)
    if (score < score_threshold):
      return None
    # Convert float [0, 1] (percent) to int [0, image_size] (pixel)
    bbox = (self.interpreter.get_tensor(self.output_details[1]['index'])[0][0]*self.image_size[0]).astype(int)
    # Ordering the bbox -> xmin, xmax, ymin ymax
    bbox[0], bbox[1], bbox[2], bbox[3] = bbox[1], bbox[0], bbox[3], bbox[2]
    print('detection done')
    return bbox, score

class LP_Ocr:
  # When initial, create tflite interpreter then allocate tensor
  def __init__(self, model_path, labels, image_size) -> None:
    self.labels = labels
    self.image_size = image_size

    self.interpreter = tflite.Interpreter(model_path = model_path)
    self.input_details = self.interpreter.get_input_details()
    self.output_details = self.interpreter.get_output_details()
    self.interpreter.allocate_tensors()

  def Ocr(self, lp_image, score_threshold):
    self.interpreter.set_tensor(self.input_details[0]['index'], lp_image[np.newaxis])
    self.interpreter.invoke()

    scores = self.interpreter.get_tensor(self.output_details[0]['index'])[0]

    # Get only characters have score pass threshold
    count = 0
    for score in scores:
      if (score < score_threshold or count > 9):
        break
      count += 1
    
    scores = np.ndarray.round(scores[0:count], 2)
    # Convert float [0, 1] (percent) to int [0, image_size] (pixel)
    bboxes = (self.interpreter.get_tensor(self.output_details[1]['index'])[0][0:count]*self.image_size[0]).astype(int)
    # Convert categories (float) -> (int) then to characters (str)
    characters = self.labels[self.interpreter.get_tensor(self.output_details[3]['index'])[0][0:count].astype(int)]
    print('recognition done')
    return scores, bboxes, characters
  