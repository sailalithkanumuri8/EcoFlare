import onnxruntime


def handler(event, request):
    session = onnxruntime.InferenceSession(
        "./model.onnx", providers=["CPUExecutionProvider"]
    )
    print(event)
    print(session)
    print("Function invoked from Python")

    return {
        "statusCode": 200,
        "body": "hi from Python!",
    }
