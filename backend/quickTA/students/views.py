import csv
import uuid
from datetime import datetime
from http.client import responses
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.utils.timezone import now
from .models import Chatlog, Conversation, Course, Feedback, User
from .serializers import ConversationSerializer, CourseSerializer, FeedbackSerializer, IncorrectChatlogSerializer, UserSerializer, ChatlogSerializer, ReportSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework import generics

from drf_yasg.utils import swagger_auto_schema
"""
Serializers 
======================================================================================================
- ensuring data returned is in the right format (JSON)
- allows data from querysets and models to be converted into python datatypes to be rendered into JSON
"""
class UserList(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    serializer = UserSerializer(queryset, many=True)
    pass

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    
    serializer = UserSerializer(queryset)
    pass

class CourseList(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

    serializer = CourseSerializer(queryset, many=True)
    pass

class CourseDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

    serializer = CourseSerializer(queryset)
    pass

class ConversationList(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.all()

    serializer = CourseSerializer(queryset, many=True)
    pass

class ConversationDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.all()

    serializer = CourseSerializer(queryset)
    pass

class ChatlogList(generics.ListCreateAPIView):
    serializer_class = ChatlogSerializer
    queryset = Chatlog.objects.all()

    serializer = ChatlogSerializer(queryset)
    pass

class ChatlogDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ChatlogSerializer
    queryset = Chatlog.objects.all()

    serializer = ChatlogSerializer(queryset)
    pass

class FeedbackList(generics.ListCreateAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()

    serializer = FeedbackSerializer(queryset)
    pass

class FeedbackDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()

    serializer = FeedbackSerializer(queryset, many=True)
    pass

@swagger_auto_schema(methods=['post'], request_body=UserSerializer)
@api_view(['POST'])
def user_detail(request):
    """
    Creates a new user.

    A User can be of the following roles:
        
        - ST: student
        - IS: instructor
        - RS: researcher
        - AM: admin

    API endpoint: /api/user
    Supported operations: /POST

    Request:
    {
        name: str,
        utorid: str,
        user_role: str
    }
    Response: {
        user_id: str
    }
    """

    if request.method == 'POST':
        try:
            request.data['user_id'] = str(uuid.uuid4())
            serializer = UserSerializer(data=request.data)
            serializer.is_valid()
            serializer.save()

            response = {
                "user_id": request.data['user_id']
            }
            return Response(response, status=status.HTTP_201_CREATED)
        except:
            error = []
            if 'name' not in request.data.keys():
                error.append("Name")
            if 'utorid' not in request.data.keys():
                error.append("Utor ID")
            if 'user_role' not in request.data.keys():
                error.append("User Role")
            err = {"msg": "User details missing fields:" + ','.join(error)}

            return Response(err, status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(methods=['post'], request_body=CourseSerializer)
@api_view(['POST'])
def course_detail(request):
    """
    Creates a new course.

    API endpoint: /api/course
    Supported operations: /POST

    Request:
    {
        course_code: str,
        semester: str
    }
    Response: {
        course_id: str,
        course_code: str,
        semester: str
    }
    """
    if request.method == 'POST':
        try:
            request.data['course_id'] = str(uuid.uuid4())
            serializer = CourseSerializer(data=request.data)
            serializer.is_valid()
            serializer.save()

            response = {
                "course_id": request.data['course_id'],
                "course_code": request.data['course_code'],
                "semester": request.data['semester']
            }

            return Response(response, status=status.HTTP_201_CREATED)

        except CourseDuplicationError:
            return Response({"msg": "Course already exists."}, status=status.HTTP_403_FORBIDDEN)
        except:
            error = []
            if 'course_code' not in request.data.keys():
                error.append("Course Code")
            if 'semester' not in request.data.keys():
                error.append("Semester")
            err = {"msg": "Course missing fields:" + ','.join(error)}

@swagger_auto_schema(methods=['post'], request_body=ConversationSerializer)
@api_view(['POST'])
def conversation_detail(request):
    """
    Retrieves a request to start a session.

    API endpoint: /api/conversation
    Supported operations: /POST

    Request: 
    {
        user_id: str,
        semester: str
    }

    Response: {
        conversation_id
    }
    """

    if request.method == 'POST':
        try:
            request.data['conversation_id'] = str(uuid.uuid4())
            request.data['status'] = 'A'
            
            serializer = ConversationSerializer(data=request.data)
            serializer.is_valid()
            serializer.save()

            response = {
                "conversation_id": request.data['conversation_id']
            }
            return Response(response, status=status.HTTP_201_CREATED)
        except:
            error = []
            if 'user_id' not in request.data.keys():
                error.append("User ID")
            if 'semester' not in request.data.keys():
                error.append("Semester")
            err = {"msg": "Conversation details missing fields: " + ','.join(error) + '.'}

            return Response(err, status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(methods=['post'], request_body=ChatlogSerializer)
@api_view(['POST'])
def chatlog_detail(request):
    """
    Retrieves a chatlog from the user, posts it and also
    returns a response from the OpenAI model.

    API endpoint: /api/chatlog
    Supported operations: /POST

    Request: 
    {
        conversation_id: str
        chatlog: str
    }

    Response:
    {
        'agent': {
            conversation_id: str
            chatlog_id: str
            is_user: boolean
            chatlog: str
            status: str
        },
        'user': {
            conversation_id: str
            chatlog_id: str
            is_user: boolean
            chatlog: str
            status: C [Correct]
        }
    }
    """
    if request.method == 'POST':

        request.data['is_user'] = True
        user_chatlog_id = str(uuid.uuid4())
        request.data['chatlog_id'] = user_chatlog_id
        request.data['status'] = 'C'
        serializer = ChatlogSerializer(data=request.data)
        try:

            # Check if conversation exists
            cid = request.data['conversation_id']
            conversation = Conversation.objects.filter(conversation_id__in=cid)

            if (len(conversation) == 0):
                raise ConversationNotFoundError          
            
            # Saves user chatlog 
            serializer.is_valid()
            serializer.save()

            # Get response from Model
            model_response = "hi"
            response = { "msg": model_response }
            
            # Save message from the Model
            data = request.data
            model_chatlog_id = str(uuid.uuid4())
            model_chatlog_data = {
                "conversation_id": data['conversation_id'],
                "chatlog_id" :  model_chatlog_id,
                "is_user": False,
                "chatlog": model_response,
                "status": 'C'
            }
            serializer = ChatlogSerializer(data=model_chatlog_data)
            serializer.is_valid()
            serializer.save()
            
            # Formatting response
            response = {
                "agent": model_chatlog_data,
                "user": {
                    "conversation_id": data['conversation_id'],
                    "chatlog_id": user_chatlog_id,
                    "is_user": True,
                    "chatlog": data['chatlog'],
                    "status": data['status']
                }
            }
            return Response(response, status=status.HTTP_201_CREATED)
        
        except:
            # Error handling
            error = []
            if 'conversation_id' not in request.data.keys():
                error.append("Conversation ID")
            if 'chatlog_id' not in request.data.keys():
                error.append("Chatlog ID")
            if 'chatlog' not in request.data.keys():
                error.append("Chatlog message")
            err = {"msg": "Chatlog details missing fields: " + ','.join(error) + '.'}

            return Response(err, status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(methods=['post'], request_body=FeedbackSerializer)
@api_view(['POST'])
def feedback_detail(request):
    """
    Retrieves and saves a feedback from the user to the database.

    Rating is an integer from 1 to 5.

    API Endpoint: /api/feedback
    Supported operations: /POST

    Request:
    {
        conversation_id: str,
        rating: int,
        feedback_msg: str
    }

    Response: 
        HTTP status code 201: CREATED
    """
    if request.method == 'POST':
        serializer = FeedbackSerializer(data=request.data)
        try:
            serializer.is_valid()
            serializer.save()
            
            return Response(serializer, status=status.HTTP_201_CREATED)
        
        except:
            # Error handling
            error = []
            if 'conversation_id' not in request.data.keys():
                error.append("Conversation ID")
            if 'rating' not in request.data.keys():
                error.append("Rating")
            if 'feedback_msg' not in request.data.keys():
                error.append("Feedback Message")
            err = {"msg": "Feedback details missing fields: " + ','.join(error) + '.'}

            return Response(err, status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(methods=['post'], request_body=ReportSerializer)
@api_view(['POST'])
def report_detail(request):
    """
    Retrieves the conversation id and returns a copy of the chatlog.

    API Endpoint: /api/report
    Supported operations: /POST

    Request:
    {
        conversation_id: str
    }

    Response: 
        CSV file containing all the chatlogs
    """
    if request.method == 'POST':
        try:
            cid = request.data['conversation_id']
            conversation = Conversation.objects.filter(conversation_id__in=cid)

            # Checks if conversation is found
            if (len(conversation) > 0):
                uid = conversation[0].user_id
            else:
                raise ConversationNotFoundError

            # Checks if user is found
            user = User.objects.filter(user_id=uid)
            if (len(user) > 0):
                user = user[0]
            else:
                raise UserNotFoundError

            chatlogs = Chatlog.objects.filter(conversation_id=cid).order_by('time')
        
            response = HttpResponse(
                content_type='text/csv',
                headers={
                    'Content-Disposition': 'attachement; filename="convo-report.csv"'
                }
            )

            writer = csv.writer(response)
            
            for chatlog in chatlogs:
                chatlog.time = chatlog.time.strftime("%m/%d/%Y %H:%M:%S")
                if chatlog.is_user:
                    writer.writerow(['[' + str(chatlog.time) + ']', str(user.name), str(chatlog.chatlog)])
                else: 
                    writer.writerow(['[' + str(chatlog.time) + ']', 'QuickTA', str(chatlog.chatlog)])
            return response

        except ConversationNotFoundError:
            return Response({"msg": "Error: Conversation not Found."}, status=status.HTTP_404_NOT_FOUND) 
        except UserNotFoundError:
            return Response({"msg": "Error: User not Found."}, status=status.HTTP_404_NOT_FOUND) 
        except:
            # Error handling
            error = []
            if 'conversation_id' not in request.data.keys():
                error.append("Conversation ID")
            err = {"msg": "Feedback details missing fields: " + ','.join(error) + '.'}

            return Response(err, status=status.HTTP_404_NOT_FOUND) 

@swagger_auto_schema(methods=['post'], request_body=IncorrectChatlogSerializer)
@api_view(['POST'])
def report_incorrect_answers(request):
    """
    Flags the given answer of a particular chatlog as wrong.

    The corresponding field, chatlog.status:
        'I' - stands for incorrect
        'C' - stands for correct

    API Endpoint: /api/incorrect-answer
    Supported operations: /POST

    Request:
    {
        conversation_id: str
        chatlog_id: str
    }

    Response: 
        HTTP status code 200: OK
    """
    if request.method == 'POST':
        try:
            
            convo_id = request.data["conversation_id"]
            chatlog_id = request.data["chatlog_id"]
        
            serializer = IncorrectChatlogSerializer(data=request.data)
            serializer.is_valid()
            
            conversation = Conversation.objects.filter(conversation_id=convo_id)
            
            if (len(conversation) == 0):
                raise ConversationNotFoundError

            chatlog = Chatlog.objects.filter(chatlog_id=chatlog_id)
            if (len(chatlog) == 0):
                raise ChatlogNotFoundError
            
            chatlog = chatlog[0]
            chatlog.status = 'I'
            chatlog.save()

            return Response(status=status.HTTP_200_OK)

        except:
            error=[]
            err = {"msg": "Report incorrect answers: " + ','.join(error) +  '.'}
            return Response(err, status=status.HTTP_404_NOT_FOUND)
    return 

# Exceptions
class UserNotFoundError(Exception): pass
class ConversationNotFoundError(Exception): pass
class ChatlogNotFoundError(Exception): pass
class CourseDuplicationError(Exception): pass
