public with sharing class ThankedMessages {
    @AuraEnabled 
    public static void updateMessages (List<Id> Users,String yourOccId,String emailBody){
        String occName='';
        list<HTB__Message__c> thMessages = new list<HTB__Message__c>();
        if(FLSCheck_apex.isAccessible(new List<String>{'id','Email'}, 'User') && FLSCheck_apex.isAccessible(new List<String>{'id','HTB__Ocassion__c'}, 'HTB__Message__c') && FLSCheck_apex.isAccessible(new List<String>{'id','HTB__Thanked__c','HTB__Your__Ocassion__c'}, 'HTB__Message__c') && FLSCheck_apex.isAccessible(new List<String>{'id','HTB__Occasion__c','HTB__User__c'}, 'HTB__Your_Ocassion__c') && FLSCheck_apex.isCreateable(new List<String>{'HTB__Your_Ocassion__c'}, 'HTB__Message__c') )
        {
            /*thMessages = [select id,HTB__Thanked__c,HTB__Your_Ocassion__r.HTB__Occasion__r.Name from HTB__Message__c where HTB__Your_Ocassion__c =: yourOccId AND OwnerId IN :Users AND HTB__Your_Ocassion__r.HTB__User__c =: UserInfo.getUserId()];
            occName = thMessages[0].HTB__Your_Ocassion__r.HTB__Occasion__r.Name;*/
            
            
            list<HTB__Message__c> messagesThanked = new List<HTB__Message__c>();
            
            for (HTB__Message__c message : thMessages){
                message.HTB__Thanked__c = true;
                messagesThanked.add(message);
            }
            update messagesThanked;
            HelperUserTrigger.sendEmail([select Id,Email,Name from User where Id IN : Users],true,occName,UserInfo.getName(),emailBody);
        } 
    }
}