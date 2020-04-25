public with sharing class UsersOcassions {
    @AuraEnabled(cacheable=true)
    public static List<Your_Ocassion__c> getOcassions(){
           return [SELECT Id,Ocassion_Date__c,Occasion__r.Name from Your_Ocassion__c where User__c =:userinfo.getuserid()];     
    }
}
