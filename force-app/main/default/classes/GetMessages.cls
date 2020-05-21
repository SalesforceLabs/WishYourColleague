public with sharing class GetMessages {
    @AuraEnabled(cacheable=true)
    public static list<HTB__Message__c> getWishes(String userId, String ocassionId,Integer offsetRows){
        List<String> fieldsMessages = new List<String>{'Id','HTB__selected_template__c','HTB__Wish__c','HTB__Your_Ocassion__c','HTB__PositionX__c','HTB__PositionY__c'};
             List<String> fieldsYourOcc = new List<String>{'HTB__Occasion__c','HTB__User__c'};
            if(FLSCheck_apex.isAccessible(fieldsMessages, 'HTB__Message__c') && FLSCheck_apex.isAccessible(fieldsYourOcc, 'HTB__Your_Ocassion__c')){
                if (ocassionId != '')
                    return [Select id, Owner.Name, HTB__selected_template__c, HTB__Wish__c,HTB__Your_Ocassion__c, HTB__Your_Ocassion__r.HTB__Occasion__r.Name,HTB__PositionX__c,HTB__PositionY__c from HTB__Message__c where HTB__Your_Ocassion__r.HTB__User__c =: userId AND HTB__Your_Ocassion__c=: ocassionId LIMIT 3 OFFSET :offsetRows];
                else {
                    list<HTB__Your_Ocassion__c> userOcc = [Select id,HTB__User__c,HTB__Occasion__r.Name,HTB__Ocassion_Date__c from HTB__Your_Ocassion__c where (HTB__User__c =: userId AND HTB__Ocassion_Date__c < TODAY) order by HTB__Ocassion_Date__c desc LIMIT 1];
                    if(!userOcc.isEmpty())
                        return [Select id, Owner.Name,HTB__selected_template__c, HTB__Wish__c,HTB__Your_Ocassion__c, HTB__Your_Ocassion__r.HTB__Occasion__r.Name,HTB__PositionX__c,HTB__PositionY__c from HTB__Message__c where HTB__Your_Ocassion__r.HTB__User__c =: userId AND HTB__Your_Ocassion__c =: userOcc[0].Id LIMIT 3 OFFSET :offsetRows];
                    else{
                        List<HTB__Message__c> emptyList = new List<HTB__Message__c>();
                        return emptyList;
                    }
                }
            }
        else
            return null;
        
        
    }
    
    @AuraEnabled(cacheable=true)
    public static HTB__Message__c getWishesByUser(String userId,String ocassionId){
         List<String> fieldsMessages = new List<String>{'Id','HTB__selected_template__c','HTB__Wish__c','HTB__Your_Ocassion__c','HTB__PositionX__c','HTB__PositionY__c'};
             List<String> fieldsYourOcc = new List<String>{'HTB__User__c'};
            if(FLSCheck_apex.isAccessible(fieldsMessages, 'HTB__Message__c') && FLSCheck_apex.isAccessible(fieldsYourOcc, 'HTB__Your_Ocassion__c'))
        		return [Select id,HTB__selected_template__c, HTB__Wish__c,HTB__PositionX__c,HTB__PositionY__c from HTB__Message__c where (HTB__Your_Ocassion__r.HTB__User__c =: userId AND OwnerId =: userinfo.getuserid() AND HTB__Your_Ocassion__c =: ocassionId)];
        	else
                return null;
    }
    
    @AuraEnabled(cacheable=true)
    public static list<HTB__Message__c> getWishesByOcc(String occId){
        List<String> fieldsMessages = new List<String>{'Id','HTB__Wish__c','HTB__Your_Ocassion__c','HTB__Thanked__c'};
         if(FLSCheck_apex.isAccessible(fieldsMessages, 'HTB__Message__c'))
        	return [select id,HTB__Wish__c,Owner.Name from HTB__Message__c where HTB__Your_Ocassion__c=: occid AND HTB__Thanked__c = false];
        else
            return null;
    }
    
}