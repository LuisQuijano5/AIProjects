from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from predict import predict_digit
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class DigitInput(BaseModel):
    pixels: list

@app.post("/predict")
def predict(input: DigitInput):
    arr = np.array(input.pixels, dtype=np.float32)
    
    matrix = arr.reshape(28, 28)

    print("=== MATRIZ 28x28 ===")
    for row in matrix:
        row_str = " ".join(f"{int(val):3}" for val in row)
        print(row_str)
    print("====================")

    pred = predict_digit(arr)
    return {"prediction": pred}