from tensorflow.keras.models import load_model


def handler(event, request):
    load_model()
    print(event)
    print("Function invoked from Python")

    return {
        "statusCode": 200,
        "body": "hi from Python!",
    }
