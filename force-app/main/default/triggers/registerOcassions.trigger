trigger registerOcassions on User (after insert) {
    if(Trigger.isAfter){
        
            HelperUserTrigger.sendEmail(trigger.new,false,'','','');
    }
}