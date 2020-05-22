trigger duplicateDetection on Your_Ocassion__c (before insert) {
            for(Your_Ocassion__c yourOcc: trigger.new){
                list<Your_Ocassion__c> userOcc = [SELECT Id, Ocassion_Date__c ,Occasion__c from Your_Ocassion__c where User__c =: yourOcc.User__c AND Occasion__c =: yourOcc.Occasion__c AND Ocassion_Date__c = THIS_YEAR LIMIT 1];
                if(!userOcc.isEmpty() && userOcc[0].Ocassion_Date__c.year() == yourOcc.Ocassion_Date__c.year()){ 
                    yourOcc.adderror('There is a record that already exist, please edit the same record if required.');
                }
            }
    
}