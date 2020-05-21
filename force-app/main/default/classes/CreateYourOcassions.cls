public with sharing class CreateYourOcassions {
    @AuraEnabled (cacheable=true)
    public static list<HTB__Occasion__c> getOcassions(){
        List<String> fieldsUsedOcc = new List<String>{'Id','Name'};
                if(FLSCheck_apex.isAccessible(fieldsUsedOcc, 'HTB__Occasion__c'))
        				return [SELECT id, Name from HTB__Occasion__c where HTB__Is_On_Occasion_Form__c = true];
                    else
                        return null;
                    
    }
   
}