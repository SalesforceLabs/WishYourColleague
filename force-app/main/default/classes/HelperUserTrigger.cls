public with sharing class HelperUserTrigger {
   
    public static List<User> sendEmail(List<User> users) {

        EmailTemplate et=[Select id from EmailTemplate where name=:'Self Register Ocassions'];

        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();


        for(User user : users){

            if( user.Email != null){

                Messaging.SingleEmailMessage singleMail = new Messaging.SingleEmailMessage();
                singleMail.setTargetObjectId(user.Id);
                singleMail.setTemplateId(et.Id);
                singleMail.setSaveAsActivity(false);
                emails.add(singleMail);
                
            }
        }

        Messaging.sendEmail(emails);

        return users;
    }
}