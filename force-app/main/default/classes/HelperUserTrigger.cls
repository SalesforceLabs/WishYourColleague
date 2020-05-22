public with sharing class HelperUserTrigger {
   
    public static void sendEmail(List<User> users,Boolean isThanks,String occName,String name,String emailBody) {
        List<String> userFields = new List<String>{'Id','Name','Email'};
         List<String> emailTemplateFields = new List<String>{'Id','Name'};
        if(FLSCheck_apex.isAccessible(userFields, 'User') &&FLSCheck_apex.isAccessible(emailTemplateFields, 'EmailTemplate') ){
        EmailTemplate et = new EmailTemplate();

        if(isThanks == false)
            et=[Select id from EmailTemplate where name=:'Self Register Ocassions'];

        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
        

        for(User user : users){
            List<String> sendTo = new List<String>();
            if( user.Email != null){
                Messaging.SingleEmailMessage singleMail = new Messaging.SingleEmailMessage();
                if(isThanks == false){
                    singleMail.setTargetObjectId(user.Id);
                    singleMail.setTemplateId(et.Id);
                    singleMail.setSaveAsActivity(false);
                    emails.add(singleMail);
                    
                }
                else{
                    sendTo.add(user.Email);
                    singleMail.subject = 'Thanks from  '+name;
                    singleMail.setHtmlBody('Hi '+user.Name+',<br/><br/><b>Message:'+emailBody+'</b><br/>'+' You had wished '+name+' on their '+occName+'. <br/> <br/>Cheers!');
                    singleMail.setToAddresses(sendTo);
                    emails.add(singleMail);
                    
                }
               
            }
        }
        Messaging.sendEmail(emails);
    
       }
    }
}