# views.py
from rest_framework import status
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import UploadedFile

class FileUploadView(APIView):
    parser_class = (FileUploadParser,)

    def post(self, request, *args, **kwargs):
        file_serializer = FileSerializer(data=request.data)

        if file_serializer.is_valid():
            uploaded_file = file_serializer.save()
            # Perform model training with TensorFlow here
            file_path = uploaded_file.file.path
            # Load the file, preprocess it, and perform training
            # Assume you have 'result' as the output text value
            result = train_model(file_path)
            return Response({'result': result}, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def train_model(file_path):
    # Load the file and perform TensorFlow model training
    # You should customize this part based on your model and use case
    # Example: Read the content of the file
    with open(file_path, 'r') as file:
        file_content = file.read()

    # Perform TensorFlow training and obtain the result
    # Example: A simple case where 'result' is the content of the file
    result = file_content

    return result
