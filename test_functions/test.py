import numpy as np

arr = np.array(['a', 'b', 'c'])
line = ''.join(arr[0:3])
print(type(line))
line = ''
for i in range(3):
  line+=arr[i]
print(line)
print(type(line))
