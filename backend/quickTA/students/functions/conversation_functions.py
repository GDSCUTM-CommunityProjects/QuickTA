import time
from datetime import date
from zoneinfo import ZoneInfo

from . import time_utils
from ..models import *
from ..constants import *
from ..database import connect

def get_conversation_cluster():
    """
    Returns a Cursor item fo the Conversation Cluster.
    """
    cluster = connect.get_cluster()
    conversation = cluster[CLUSTER][CONVERSATION_COLLECTION]
    return conversation

def get_conversation_chatlog(conversation_id: str) -> str:
    """
    Acquires a copy of all of the chatlogs from the provided <conversation_id>
    """
    convo_cluster = get_conversation_cluster()
    convo = convo_cluster.find({"conversation_id": conversation_id})
    convo = list(convo)[0]
    if "gpt_chatlog" in convo.keys():
        return convo["gpt_chatlog"]
    return ""

def post_conversation_chatlog(conversation_id: str, chatlog_history: str) -> str:
    """
    Posts all <chatlog_history> OpenAI text prompt to the 
    corresponding Conversation given the <conversation_id> 
    """
    try:
        convos = get_conversation_cluster()
        print(chatlog_history)
        convos.update_one(
            {"conversation_id": conversation_id},
            {"$set": { "gpt_chatlog" : chatlog_history}}
        )
        return OPERATION_SUCCESSFUL
    except:
        return OPERATION_FAILED

def get_filtered_convos(course_id, view, timezone):
    """
    Returns a list of convo_ids of course <course_id> with a specific
    filter <view> in the given time format <timezone>.
    """

    start_date, end_date = time_utils.get_dates(view, timezone)

    # Retrieve all convesrations from the course given the particular datetime
    if start_date and end_date:
        
        start = time.time()
        convos = Conversation.objects.filter(
                course_id=course_id
            ).filter(
                start_time__gte=start_date
            ).filter(
                start_time__lt=end_date
            )
        end = time.time()
        print("Time elapsed (Conversation filtering):", (end-start) * 1000)

    else:
        convos = Conversation.objects.filter(course_id=course_id)
    return convos

def get_filtered_interactions(course_id, dates, timezone):
    """
    Returns a list of interactions of certain <dates> for course <course_id>.
    """
    interactions = []
    tz = ZoneInfo(timezone)
    # Retrieve all convesrations from the course given the particular datetime

    convos_cluster = get_conversation_cluster()

    if dates:
        total = 0
        for _date in dates:
            day, weekday = _date
            
            year_of_day = int(day.year)
            month_of_day = int(day.month)
            day_of_day = int(day.day)
        
            start_date = datetime(year_of_day, month_of_day, day_of_day, tzinfo=tz)
            
            # Handle offset_date day increment
            try:
                offset_date = datetime(year_of_day, month_of_day, day_of_day + 1, tzinfo=tz)
                
            except:
                try:
                    offset_date = datetime(year_of_day, month_of_day + 1, 1, tzinfo=tz)
                except:
                    offset_date = datetime(year_of_day + 1, 1, 1, tzinfo=tz)
            
           
            convos = Conversation.objects.filter(
                    course_id=course_id
                ).filter(
                    start_time__gte=start_date
                ).filter(
                    start_time__lt=offset_date
                )
            count = len(convos)
            # count = convos_cluster.aggregate([
            #     {
            #         "$match": {
            #             "$and": [
            #                 { "course_id": course_id} ,
            #                 { "start_time": {
            #                         "$gte": start_date,
            #                         "$lt": offset_date,
            #                     }
            #                 }
            #             ]
            #         }
            #     },
            #     {
            #         "$count": "course_id"
            #     }
            # ])
            
            day_f = day.strftime('%Y-%m-%d')
            
            # start = time.time()
            interactions.append((day_f, weekday, count))
            # end = time.time()
        #     print("Time elapsed (Date [" + str(day_of_day) + "])", (end-start) * 1000)
        #     total += end-start
        # print("Time elapsed (Date)", total * 1000)

    return interactions

print(get_conversation_chatlog("69033ecd-ee6f-4991-9812-a930dff97a47"))