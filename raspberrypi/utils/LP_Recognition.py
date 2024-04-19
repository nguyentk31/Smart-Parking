import numpy as np
import cv2
import tflite_runtime.interpreter as tflite

class LP_Detection:
  # When initial, create tflite interpreter then allocate tensor
  def __init__(self, model_path) -> None:
    self.interpreter = tflite.Interpreter(model_path = model_path)
    self.input_details = self.interpreter.get_input_details()
    self.output_details = self.interpreter.get_output_details()

    self.input_size = self.input_details[0]['shape'][1:3]
    self.interpreter.allocate_tensors()

  def detect(self, image, score_threshold):
    image_size = image.shape[0:2]
    if (not (image_size == self.input_size).all()):
      image = cv2.resize(image, self.input_size)
    self.interpreter.set_tensor(self.input_details[0]['index'], image[np.newaxis])
    self.interpreter.invoke()

    # Check if score pass threshold, if not then drop it
    score = self.interpreter.get_tensor(self.output_details[0]['index'])[0][0]
    if (score < score_threshold):
      return None
    # Convert float [0, 1] (percent) to int [0, image_size] (pixel)
    bbox = self.interpreter.get_tensor(self.output_details[1]['index'])[0][0]
    # Ordering the bbox -> xmin, ymin, xmax ymax
    bbox[0], bbox[1], bbox[2], bbox[3] = bbox[1]*image_size[0], bbox[0]*image_size[1], bbox[3]*image_size[0], bbox[2]*image_size[1]
    print('detection done')
    return bbox.astype(int), round(score, 2)

class LP_Ocr:
  # When initial, create tflite interpreter then allocate tensor
  def __init__(self, model_path, labels_path) -> None:
    # Read labelmap.txt file
    with open(labels_path, 'r') as f:
      self.labels = np.array([line.strip() for line in f], str)

    self.interpreter = tflite.Interpreter(model_path = model_path)
    self.input_details = self.interpreter.get_input_details()
    self.output_details = self.interpreter.get_output_details()

    self.input_size = self.input_details[0]['shape'][1:3]
    self.interpreter.allocate_tensors()

  def Ocr(self, image, score_threshold):
    image_size = image.shape[0:2]
    if (not (image_size == self.input_size).all()):
      image = cv2.resize(image, self.input_size)

    self.interpreter.set_tensor(self.input_details[0]['index'], image[np.newaxis])
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
    bboxes = self.interpreter.get_tensor(self.output_details[1]['index'])[0][0:count]
    bboxes[:,0], bboxes[:,1], bboxes[:,2], bboxes[:,3] = bboxes[:,1]*image_size[0], bboxes[:,0]*image_size[1], bboxes[:,3]*image_size[0], bboxes[:,2]*image_size[1]
    # Convert categories (float) -> (int) then to characters (str)
    characters = self.labels[self.interpreter.get_tensor(self.output_details[3]['index'])[0][0:count].astype(int)]
    print('recognition done')
    return scores, bboxes.astype(int), characters
  