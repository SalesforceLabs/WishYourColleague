public with sharing class GetAttachedTemplates {
    @AuraEnabled 
    public static list<ContentVersion> getTemplates(String occId){
        String occasionId = String.escapeSingleQuotes(occId);
        list<ContentDocumentLink> documentLinkIds= new list<ContentDocumentLink>();
        HTB__Your_Ocassion__c getOccasionId = new HTB__Your_Ocassion__c();
        if(FLSCheck_apex.isAccessible(new List<String>{'Id','HTB__Occasion__c'}, 'HTB__Your_Ocassion__c'))
        {
            getOccasionId = [select HTB__Occasion__c from HTB__Your_Ocassion__c where id=: occasionId];
        }
        else{
            return null;
        }    
        List<String> cdl = new List<String>{};
            if(FLSCheck_apex.isAccessible(new List<String>{'Id'}, 'ContentDocumentLink') && FLSCheck_apex.isAccessible(new List<String>{'Id', 'title'}, 'ContentDocument'))
        {       
            documentLinkIds = [select Id,ContentDocumentId,ContentDocument.title  from ContentDocumentLink where LinkedEntityId =:getOccasionId.HTB__Occasion__c];
        }   else{
            return null;
        }     
        list <ContentVersion> contentVersion  = new list <ContentVersion>();
        for (Integer i=0;i< documentLinkIds.size();i++){
            List<ContentVersion> cv= new List<ContentVersion>();
            if(FLSCheck_apex.isAccessible(new List<String>{'Id','ContentBodyId','ContentDocumentId', 'HTB__Is_Public__c', 'OwnerId'}, 'ContentVersion') && FLSCheck_apex.isAccessible(new List<String>{'latestpublishedversionid','FileType'}, 'ContentDocument'))
            {
                cv = [select Id,ContentBodyId,ContentDocument.latestpublishedversionid, ContentDocument.FileType from ContentVersion where ContentDocumentId =: documentLinkIds[i].ContentDocumentId AND (HTB__Is_Public__c =true OR OwnerId =: userinfo.getuserid())];
                if(!cv.isEmpty()){
                    if(cv[0].ContentDocument.FileType == 'JPG' || cv[0].ContentDocument.FileType == 'PNG' || cv[0].ContentDocument.FileType == 'JPEG')
                        contentVersion.add(cv[0]);
                }
            } else{
                return null;
            }
            
        }
        
        return contentVersion;
    }
}