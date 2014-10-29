# A Linkedin contact ranker

This app is based on Angular and was seeded with the project: https://github.com/angular/angular-seed.  If you want to run a local copy follow the instructions found in the project README.


The idea was that this someone who's using this list would be looking for a job and a job in their current city.  The ranking algorithm takes into account the connection's current location, their industry, and the number of connections they have.

For location, a significance list was created (meaning locations were ranked by importance to me. I hard coded it for challenge, but this would be calculated in the real world) and then each connection was assigned a value based on where they fall in the list.

For industry, if the connection lists their industry as a recruiter, they score the highest points since they'll have the best possible chance of finding me a job.  If they work in tech, they score the next highest amount of points, everything else scores the least. (This list was also hardcoded, but would be calculated in the real world).

Also, the more people the connection knows, the higher they're ranked since there's a better chance that they'll know someone who's looking to hire.

The three sections are then added together resulting in the connection's rank.