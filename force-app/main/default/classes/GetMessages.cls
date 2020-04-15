public with sharing class GetMessages {
    @AuraEnabled(cacheable=true)
    public static list<Message__c> getWishes(String userId){
        return [Select id, selected_template__c, Wish__c, Your_Ocassion__r.Occasion__r.Name,PositionX__c,PositionY__c from Message__c where Your_Ocassion__r.OwnerId =: userId];
    }
    
}
