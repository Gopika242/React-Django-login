from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse, response
import json
from rest_framework.response import Response
from rest_framework import status



def custom200(message, data=None):
    return Response(
        {
            "status": "Success",
            "status_code": 200,
            "message": message,
            "data": data if data is not None else {},
        },
        status=status.HTTP_200_OK,
    )


def custom404(request, message):
    if isinstance(message, dict):
        first_field, first_error = next(iter(message.items()))
        error_message = f"{first_field}: {''.join(first_error)}"
    else:
        error_message = str(message)

    return Response(
        {
            "status": "Failed",
            "status_code": 404,
            "message": error_message,
        },
        status=404,
    )

