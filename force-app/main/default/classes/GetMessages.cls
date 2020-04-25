public with sharing class GetMessages {
    @AuraEnabled(cacheable=true)
    public static list<Message__c> getWishes(String userId, String ocassionId){
        if (ocassionId != '')
            return [Select id, selected_template__c, Wish__c,Your_Ocassion__c, Your_Ocassion__r.Occasion__r.Name,PositionX__c,PositionY__c from Message__c where Your_Ocassion__r.OwnerId =: userId AND Your_Ocassion__c=: ocassionId];
        else {
            list<Your_Ocassion__c> userOcc = [Select id,User__c,Occasion__r.Name,Ocassion_Date__c from Your_Ocassion__c where (OwnerId =: userId AND Ocassion_Date__c < TODAY) order by Ocassion_Date__c desc LIMIT 1];
   
            return [Select id, selected_template__c, Wish__c,Your_Ocassion__c, Your_Ocassion__r.Occasion__r.Name,PositionX__c,PositionY__c from Message__c where Your_Ocassion__r.OwnerId =: userId AND Your_Ocassion__c =: userOcc[0].Id];
        }
    }

    @AuraEnabled(cacheable=true)
    public static Message__c getWishesByUser(String userId,String ocassionId){
        return [Select id,selected_template__c, Wish__c,PositionX__c,PositionY__c from Message__c where (Your_Ocassion__r.OwnerId =: userId AND OwnerId =: userinfo.getuserid() AND Your_Ocassion__c =: ocassionId)];
    }
    
}
