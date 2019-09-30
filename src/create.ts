import * as inquirer from "inquirer";
import * as execa from "execa";
import path from "path";
import Listr from "listr";

const replaceInFiles = require('replace-in-files');


inquirer
  .prompt({
    type: 'list',
    name: 'project_type',
    message: "Which type of project you want to create?",
    choices: ['Module']
  })
  .then(({project_type}) => {
    inquirer.prompt({
      type: 'input',
      name: 'name',
      message: 'Name',
    }).then(({name}) => {
      const tasks = new Listr([
        {
          title: 'Fetching templates',
          task: () => execa.command('git clone git@github.com:puzzle-js/templates.git /tmp/puzzle-template')
        },
        {
          title: 'Moving template',
          task: () => execa.command(`mv /tmp/puzzle-template/${project_type} ${path.join(process.cwd(), `./${name}`)}`)
        },
        {
          title: 'Cleaning Garbage',
          task: () => execa.command('rm -rf /tmp/puzzle-template')
        },
        {
          title: 'Configuring Project',
          task: () => {
            return new Listr([
              {
                title: 'Setting Variables',
                task: () =>{
                  return new Promise((resolve,reject) => {
                    replaceInFiles({
                      files: `${path.join(process.cwd(), `./${name}`)}/**`,
                      from: '###module_name###',
                      to: name
                    }).then(resolve);
                  });
                }
              },
            ])
          }
        }
      ]);

      tasks.run().catch(err => {
        console.error(err);
      });
    });
  });
