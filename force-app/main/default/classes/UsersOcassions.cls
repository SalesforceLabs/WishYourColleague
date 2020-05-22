public with sharing class UsersOcassions {
    @AuraEnabled(cacheable=true)
    public static List<HTB__Your_Ocassion__c> getOcassions(String keyTerm){
        List<String> fieldsUsed = new List<String>{'HTB__Ocassion_Date__c','HTB__User__c'};
            List<String> fieldsUsedOcc = new List<String>{'Id','Name'};
                if(FLSCheck_apex.isAccessible(fieldsUsed, 'HTB__Your_Ocassion__c') && FLSCheck_apex.isAccessible(fieldsUsedOcc, 'HTB__Occasion__c')){
                    if(keyTerm == '' || keyTerm == null)
                        return [SELECT Id,HTB__Ocassion_Date__c,HTB__Occasion__r.Name from HTB__Your_Ocassion__c where HTB__User__c =:userinfo.getuserid() AND HTB__Ocassion_Date__c < TODAY ]; 
                    else {
                        String searchString = '%' + keyTerm + '%';
                        return [SELECT Id,HTB__Ocassion_Date__c,HTB__Occasion__r.Name from HTB__Your_Ocassion__c where HTB__User__c =:userinfo.getuserid() and HTB__Occasion__r.Name LIKE :searchString AND HTB__Ocassion_Date__c < TODAY];
                    }    
                }
        else{
            System.debug('No access to Record!!!');
            return null;
        }
        
    }
    
    @AuraEnabled
    public static List<HTB__Your_Ocassion__c> getAllOccasionsThisYear(){
        List<String> fieldsUsed = new List<String>{'HTB__Ocassion_Date__c', 'HTB__User__c'};
            List<String> fieldsUsedOcc = new List<String>{'Id','Name'}; 
                if(FLSCheck_apex.isAccessible(fieldsUsed, 'HTB__Your_Ocassion__c') && FLSCheck_apex.isAccessible(fieldsUsedOcc, 'HTB__Occasion__c')){
                    
                    return [SELECT Id,HTB__Ocassion_Date__c,HTB__Occasion__r.Name,HTB__Occasion__c from HTB__Your_Ocassion__c where HTB__User__c =:userinfo.getuserid() AND HTB__Ocassion_Date__c = THIS_YEAR ]; 
                } else{
                    System.debug('No access to Record!!!');
                    return null;
                }
    }
}