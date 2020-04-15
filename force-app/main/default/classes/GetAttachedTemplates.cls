public with sharing class GetAttachedTemplates {
   @AuraEnabled (cacheable=true)
   public static list<ContentVersion> getTemplates(String occId){
       Your_Ocassion__c getOccasionId = [select Occasion__c from Your_Ocassion__c where id=: occId];
        list<ContentDocumentLink> documentLinkIds = [select Id,ContentDocumentId,ContentDocument.title  from ContentDocumentLink where LinkedEntityId =:getOccasionId.Occasion__c];
        list <ContentVersion> contentVersion  = new list <ContentVersion>();

        for (Integer i=0;i< documentLinkIds.size();i++){
            ContentVersion cv= [ select Id,ContentBodyId,ContentDocument.latestpublishedversionid, ContentDocument.FileType from ContentVersion where ContentDocumentId =: documentLinkIds[i].ContentDocumentId];
            if(cv.ContentDocument.FileType == 'JPG' || cv.ContentDocument.FileType == 'PNG' || cv.ContentDocument.FileType == 'JPEG')
                contentVersion.add(cv);
        }
       return contentVersion;
   }
}
