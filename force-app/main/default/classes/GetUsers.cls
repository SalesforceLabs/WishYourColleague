public with sharing class GetUsers {
    @AuraEnabled(cacheable=true)
    public static list<HTB__Your_Ocassion__c> getUsersWithOcc(String userId){
        List<String> fieldsYourOcc = new List<String>{'HTB__Occasion__c','HTB__User__c','HTB__Ocassion_Date__c','Id','HTB__Hide_the_wishes__c'};
            if(FLSCheck_apex.isAccessible(fieldsYourOcc, 'HTB__Your_Ocassion__c')){
        if(userId != ''){
            return [Select id, HTB__Ocassion_Date__c,HTB__Occasion__r.Name,HTB__User__r.Name from HTB__Your_Ocassion__c where (HTB__Ocassion_Date__c = LAST_N_DAYS:7 OR HTB__Ocassion_Date__C = NEXT_N_DAYS:7) AND  HTB__User__c =: userId AND HTB__Hide_the_wishes__c = false];
        }else{
            return [Select id, HTB__User__r.Name,HTB__User__r.FullPhotoUrl from HTB__Your_Ocassion__c where (HTB__Ocassion_Date__c = LAST_N_DAYS:7 OR HTB__Ocassion_Date__C = NEXT_N_DAYS:7) AND HTB__User__r.Id !=: userinfo.getuserid() AND HTB__Hide_the_wishes__c = false];
        }
           
    }
        else
            return null;
    }

   
}