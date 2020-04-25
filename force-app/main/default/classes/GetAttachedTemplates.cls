public with sharing class GetAttachedTemplates {
   @AuraEnabled 
   public static list<ContentVersion> getTemplates(String occId){
       Your_Ocassion__c getOccasionId = [select Occasion__c from Your_Ocassion__c where id=: occId];
        list<ContentDocumentLink> documentLinkIds = [select Id,ContentDocumentId,ContentDocument.title  from ContentDocumentLink where LinkedEntityId =:getOccasionId.Occasion__c];
        list <ContentVersion> contentVersion  = new list <ContentVersion>();

        for (Integer i=0;i< documentLinkIds.size();i++){
            List<ContentVersion> cv= [select Id,ContentBodyId,ContentDocument.latestpublishedversionid, ContentDocument.FileType from ContentVersion where ContentDocumentId =: documentLinkIds[i].ContentDocumentId AND (Is_Public__c =true OR OwnerId =: userinfo.getuserid())];

            if(!cv.isEmpty()){
                if(cv[0].ContentDocument.FileType == 'JPG' || cv[0].ContentDocument.FileType == 'PNG' || cv[0].ContentDocument.FileType == 'JPEG')
                contentVersion.add(cv[0]);
            }
        }
       return contentVersion;
   }
}
