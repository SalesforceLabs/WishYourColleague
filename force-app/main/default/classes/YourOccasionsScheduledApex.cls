global class YourOccasionsScheduledApex implements Schedulable{
	global void execute(SchedulableContext sc) {
      YourOccasionsBatch b = new YourOccasionsBatch(); 
      database.executebatch(b);
   }
}