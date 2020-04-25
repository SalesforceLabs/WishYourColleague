public with sharing class GetUsers {
    @AuraEnabled(cacheable=true)
    public static list<Your_Ocassion__c> getUsersWithOcc(String userId){
        if(userId != ''){
            return [Select id, Ocassion_Date__c,Occasion__r.Name,User__r.Name from Your_Ocassion__c where (Ocassion_Date__c = LAST_N_DAYS:7 OR Ocassion_DATE__C = NEXT_N_DAYS:7) AND  User__c =: userId];
        }else{
            return [Select id, User__r.Name,User__r.FullPhotoUrl from Your_Ocassion__c where (Ocassion_Date__c = LAST_N_DAYS:7 OR Ocassion_DATE__C = NEXT_N_DAYS:7) AND User__r.Id !=: userinfo.getuserid()];
        }
           
    }

   
}
