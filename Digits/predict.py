import numpy as np

def ReLU(Z):
    return np.maximum(0, Z)

def softmax(Z):
    Z = Z - np.max(Z, axis=0, keepdims=True)
    expZ = np.exp(Z)
    return expZ / np.sum(expZ, axis=0, keepdims=True)

def forward_prop(W1, b1, W2, b2, X):
    Z1 = W1.dot(X) + b1
    A1 = ReLU(Z1)
    Z2 = W2.dot(A1) + b2
    A2 = softmax(Z2)
    return A2

def load_model():
    data = np.load("model/weights.npz")
    return data["W1"], data["b1"], data["W2"], data["b2"]

def predict_digit(img_vector):
    W1, b1, W2, b2 = load_model()

    X = img_vector.reshape(784, 1) / 255.0
    A2 = forward_prop(W1, b1, W2, b2, X)

    return int(np.argmax(A2, axis=0)[0])