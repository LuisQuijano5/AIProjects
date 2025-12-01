import numpy as np
import pandas as pd

# Cargar y preparar datos MNIST

data = pd.read_csv("data/train.csv").to_numpy()
np.random.shuffle(data)

X = data[:, 1:].T / 255.0   
Y = data[:, 0]     
m = X.shape[1]

def one_hot(Y):
    one_hot_Y = np.zeros((10, Y.size))
    one_hot_Y[Y, np.arange(Y.size)] = 1
    return one_hot_Y

Y_onehot = one_hot(Y)

# Red Neuronal

def init_params():
    neurons_hidden = 128
    W1 = np.random.randn(neurons_hidden, 784) * np.sqrt(2/784)
    b1 = np.zeros((neurons_hidden, 1))
    W2 = np.random.randn(10, neurons_hidden) * np.sqrt(2/neurons_hidden)
    b2 = np.zeros((10, 1))
    return W1, b1, W2, b2

def ReLU(Z):
    return np.maximum(0, Z)

def ReLU_deriv(Z):
    return Z > 0

def softmax(Z):
    Z = Z - np.max(Z, axis=0, keepdims=True)
    expZ = np.exp(Z)
    return expZ / np.sum(expZ, axis=0, keepdims=True)

def forward_prop(W1, b1, W2, b2, X):
    Z1 = W1.dot(X) + b1
    A1 = ReLU(Z1)
    Z2 = W2.dot(A1) + b2
    A2 = softmax(Z2)
    return Z1, A1, Z2, A2

def backward_prop(Z1, A1, A2, W2, X, Y_onehot):
    m = X.shape[1]

    dZ2 = A2 - Y_onehot
    dW2 = (1/m) * dZ2.dot(A1.T)
    db2 = (1/m) * np.sum(dZ2, axis=1, keepdims=True)

    dZ1 = W2.T.dot(dZ2) * ReLU_deriv(Z1)
    dW1 = (1/m) * dZ1.dot(X.T)
    db1 = (1/m) * np.sum(dZ1, axis=1, keepdims=True)

    return dW1, db1, dW2, db2

def update_params(W1, b1, W2, b2, dW1, db1, dW2, db2, lr):
    W1 -= lr * dW1
    b1 -= lr * db1
    W2 -= lr * dW2
    b2 -= lr * db2
    return W1, b1, W2, b2

#ENTRENAMIENTO

def train(X, Y, Y_onehot, lr=0.1, it=1500):
    W1, b1, W2, b2 = init_params()
    for i in range(it):
        Z1, A1, Z2, A2 = forward_prop(W1, b1, W2, b2, X)
        dW1, db1, dW2, db2 = backward_prop(Z1, A1, A2, W2, X, Y_onehot)

        W1, b1, W2, b2 = update_params(W1, b1, W2, b2, dW1, db1, dW2, db2, lr)

        if i % 100 == 0:
            predictions = np.argmax(A2, axis=0)
            acc = np.mean(predictions == Y)
            print(f"Iter {i} - Accuracy: {acc:.4f}")

    return W1, b1, W2, b2


W1, b1, W2, b2 = train(X, Y, Y_onehot)

np.savez("model/weights.npz", W1=W1, b1=b1, W2=W2, b2=b2)
print("Modelo entrenado y guardado en model/weights.npz")
