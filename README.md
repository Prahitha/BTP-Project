## Yoga pose estimation
#### Overview
In the light of recent events with the pandemic, Yoga has gained a lot of popularity across the globe due to its physical and mental health benefits. The objective of this project is to build a classification model that would recognize various yoga postures or asanas from a small set of images using a combination of PoseNet and Deep Learning. This will involve a virtual trainer who will take us through a series of postures, demonstrating each pose and then instructing us to do it together. The poses will typically held for 10 seconds. Users get feedback on their posture and possible improvements, by the pose estimation model immediately. This will be a minimal investment model and will help the users practice yoga from the comfort of their homes just by using their camera. The overall system achieved an accuracy of 93% in classifying 3 different yoga postures from images.

#### Methodology
1. The dataset is taken from Kaggle and A. Marchenkova's dataset. These images are senti into PoseNet to get the key points and predict the poses. These key pointsare then used to further compare and analyze with the user’s key points.
2. The model which is being used is a small yet efficient neural network which is trained using TensorFlow. This model is then saved with the metadata in json and the weights in binary files.
3. These are then loaded using the ml5 neural network function - which is the core of the program.
4. The wrong keypoints are calculated using the arctan between the user's and the trainer's keypoints. If the difference is greater than 30 then it is classified as wrong and is shown in red color. By alerting the user of the wrong posture, it will be easier to exercise and learn comfortably.

#### Future work
1. Adding different levels and categories to choose from. Ranging from beginner to advanced and classic to modern yoga forms.
2. Adding a plot or story to make it more interesting and interactive.
3. Adding music and 3D assets for a more wholesome experience.
4. Including a progress chart and reward system to increase user's accountability and sense of achievement.
