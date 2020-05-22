# Salesforce App

This guide helps Salesforce developers who are new to Visual Studio Code go from zero to a deployed app using Salesforce Extensions for VS Code and Salesforce CLI.

## Part 1: Choosing a Development Model

There are two types of developer processes or models supported in Salesforce Extensions for VS Code and Salesforce CLI. These models are explained below. Each model offers pros and cons and is fully supported.

### Package Development Model

The package development model allows you to create self-contained applications or libraries that are deployed to your org as a single package. These packages are typically developed against source-tracked orgs called scratch orgs. This development model is geared toward a more modern type of software development process that uses org source tracking, source control, and continuous integration and deployment.

If you are starting a new project, we recommend that you consider the package development model. To start developing with this model in Visual Studio Code, see [Package Development Model with VS Code](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/package-development-model). For details about the model, see the [Package Development Model](https://trailhead.salesforce.com/en/content/learn/modules/sfdx_dev_model) Trailhead module.

If you are developing against scratch orgs, use the command `SFDX: Create Project` (VS Code) or `sfdx force:project:create` (Salesforce CLI)  to create your project. If you used another command, you might want to start over with that command.

When working with source-tracked orgs, use the commands `SFDX: Push Source to Org` (VS Code) or `sfdx force:source:push` (Salesforce CLI) and `SFDX: Pull Source from Org` (VS Code) or `sfdx force:source:pull` (Salesforce CLI). Do not use the `Retrieve` and `Deploy` commands with scratch orgs.

### Org Development Model

The org development model allows you to connect directly to a non-source-tracked org (sandbox, Developer Edition (DE) org, Trailhead Playground, or even a production org) to retrieve and deploy code directly. This model is similar to the type of development you have done in the past using tools such as Force.com IDE or MavensMate.

To start developing with this model in Visual Studio Code, see [Org Development Model with VS Code](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/org-development-model). For details about the model, see the [Org Development Model](https://trailhead.salesforce.com/content/learn/modules/org-development-model) Trailhead module.

If you are developing against non-source-tracked orgs, use the command `SFDX: Create Project with Manifest` (VS Code) or `sfdx force:project:create --manifest` (Salesforce CLI) to create your project. If you used another command, you might want to start over with this command to create a Salesforce DX project.

When working with non-source-tracked orgs, use the commands `SFDX: Deploy Source to Org` (VS Code) or `sfdx force:source:deploy` (Salesforce CLI) and `SFDX: Retrieve Source from Org` (VS Code) or `sfdx force:source:retrieve` (Salesforce CLI). The `Push` and `Pull` commands work only on orgs with source tracking (scratch orgs).

## The `sfdx-project.json` File

The `sfdx-project.json` file contains useful configuration information for your project. See [Salesforce DX Project Configuration](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_ws_config.htm) in the _Salesforce DX Developer Guide_ for details about this file.

The most important parts of this file for getting started are the `sfdcLoginUrl` and `packageDirectories` properties.

The `sfdcLoginUrl` specifies the default login URL to use when authorizing an org.

The `packageDirectories` filepath tells VS Code and Salesforce CLI where the metadata files for your project are stored. You need at least one package directory set in your file. The default setting is shown below. If you set the value of the `packageDirectories` property called `path` to `force-app`, by default your metadata goes in the `force-app` directory. If you want to change that directory to something like `src`, simply change the `path` value and make sure the directory you’re pointing to exists.

```json
"packageDirectories" : [
    {
      "path": "force-app",
      "default": true
    }
]
```

## Part 2: Working with Source

For details about developing against scratch orgs, see the [Package Development Model](https://trailhead.salesforce.com/en/content/learn/modules/sfdx_dev_model) module on Trailhead or [Package Development Model with VS Code](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/package-development-model).

For details about developing against orgs that don’t have source tracking, see the [Org Development Model](https://trailhead.salesforce.com/content/learn/modules/org-development-model) module on Trailhead or [Org Development Model with VS Code](https://forcedotcom.github.io/salesforcedx-vscode/articles/user-guide/org-development-model).

## Part 3: Deploying to Production

Don’t deploy your code to production directly from Visual Studio Code. The deploy and retrieve commands do not support transactional operations, which means that a deployment can fail in a partial state. Also, the deploy and retrieve commands don’t run the tests needed for production deployments. The push and pull commands are disabled for orgs that don’t have source tracking, including production orgs.

Deploy your changes to production using [packaging](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_dev2gp.htm) or by [converting your source](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_force_source.htm#cli_reference_convert) into metadata format and using the [metadata deploy command](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_force_mdapi.htm#cli_reference_deploy).


ABOUT THE APP:
=================
Description: This app's main Intention is to digitalize the wishes and erradicate greeting cards. We have made a solution for salesforce users to wish their colleagues from their bottom of the heart using this APP. They can make the wishes special to their colleagues and their extended family using this Application.

Here we go on how to register your ocassions so that the users in the org would be notified.

Enter Your Occasions:
===========
- When a user is onboarded there will be an email that is triggered asking for them to create their "Occasions" (share your memorable moments)

1.)These occasions are dynamically created on the form , when the admin creates a record in the "Occasions" object and making "Is On Occasion Form" to checked.

2.)This makes the occasion disappear from the form once the user enters the date of the occasion in order to prevent duplicates.

Flow and process builder
========
3.)Once after the ocassion is created there will be a (@mention) that would be triggered to the manager and their team memebers (except the ocassion "User") helping their team memebers to wish the user.

4.) Now the their colleagues can go to the "Wish your colleague" tab or (the users detail page, click on "Wish your colleague") to send them wishes.


Update Ocassions:
=======
- Occasions would be automatically updated each year wihtout any manual intervention or the user requiring to input their "Special days" every year.
- There would not be duplicate ocassion (Your Ocassions) not allowed to be created, but you can always edit the created ocassion to change the date or hide the wishes.


Wish your colleague
=============
5.) From the wish your colleague component, you will need to select the user, ocassion and the template , optionally you can also put in text (wish) in the bottom right, this text would then apply on to the template selected and the preview of the greeting would be updated.

6.) Now the user can move the sliders to adjust the placement of the text on the template.

7.) Optionally you can also choose upload your own file instead off using the standard templates, the templates that the users upload would only be seen to the specific user who uploaded it. 

8.) Now Click on submit, which sends wishes to the target user.

(OR)

- Their colleague may go to the user page and then click on "Wish your colleague", not their colleague would see a pop-up, which is requesting them to select the ocassion for which the current user is to be wished on, this is a representation of the same "Wish your colleague" component in a different way.

The Profile Component:
========================

9.) Once a colleague sends wishes to the User to one of their colleagues for a occasion that they have, they would see it on the profile component with animations once the "Occassion Date" crosses by, until then it would be a surprise for the user.

10.) They get the information on who has sent the wishes at the bottom left and they can pause the animations to read the wishes writtern by their colleagues.
- Once if you have already wished the same user on the same ocassions, you will be able to edit the same wish and edit the placement of the wish on the template, but not wishing the same user one more time on the same ocassion.
Select a Ocassion:
===================
11.) There is a button on the profile component which allows to belated ocassion with dates.

12.) Once the users selects a checkbox and clicks on the button "SEE your memories", the animations and images starts playing in the profile component where the ocassions_date < Today

Give Thanks:
=============

13.) Now the user can send their colleagues "Thanks" (give thanks) for the warm wishes, The user while seeing the animations would click on give thanks, now there would be a pop-up that would show all the wishes for the ocassion that the user selected.

Note: Default ocassion would be the latest belated occasion.


14.) This makes the the colleague recieve an email with the "message" that user "Thanked".
