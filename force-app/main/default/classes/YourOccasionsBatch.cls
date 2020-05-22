global class YourOccasionsBatch implements Database.Batchable<sObject> {
    global Database.QueryLocator start(Database.BatchableContext bc) {
        
        String query = 'SELECT Id, HTB__Occasion__c, HTB__User__c, HTB__Ocassion_Date__c, HTB__Hide_the_wishes__c FROM HTB__Your_Ocassion__c where HTB__Ocassion_Date__c = LAST_MONTH';
            return Database.getQueryLocator(query);
    }
    global void execute(Database.BatchableContext bc, List<HTB__Your_Ocassion__c> records){
        List<String> fieldsUsedOcc = new List<String>{'Id','Name','HTB__Occasion__c','HTB__Hide_the_wishes__c','HTB__User__c','HTB__Ocassion_Date__c'};
         List<String> creatableFields = new List<String>{'HTB__Occasion__c','HTB__Hide_the_wishes__c','HTB__User__c','HTB__Ocassion_Date__c'};
                list<HTB__Your_Ocassion__c> newOccs = new List<HTB__Your_Ocassion__c>();
                if(FLSCheck_apex.isAccessible(fieldsUsedOcc, 'HTB__Your_Ocassion__c') && FLSCheck_apex.isCreateable(creatableFields,'HTB__Your_Ocassion__c')){
                for(HTB__Your_Ocassion__c occ: records){
                   
                    HTB__Your_Ocassion__c occNew = new HTB__Your_Ocassion__c();
                    occNew.HTB__Occasion__c= occ.HTB__Occasion__c;
                    occNew.HTB__Hide_the_wishes__c=occ.HTB__Hide_the_wishes__c;
                    occNew.HTB__User__c=occ.HTB__User__c;
                    occNew.HTB__Ocassion_Date__c=occ.HTB__Ocassion_Date__c.addYears(1);
                    newOccs.add(occNew);
                }
                
                    insert newOccs;
                }
            }
    
    global void finish(Database.BatchableContext bc){}
}