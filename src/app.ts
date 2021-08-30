interface IValidatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

const validate = (validatableObj: IValidatable) => {
  let isValid = true;

  if (validatableObj.required) {
    isValid = isValid && !!validatableObj.value.toString().trim().length;
  }
  if (
    validatableObj.minLength != null &&
    typeof validatableObj.value === "string"
  ) {
    isValid =
      isValid && validatableObj.value.length >= validatableObj.minLength;
  }
  if (
    validatableObj.maxLength != null &&
    typeof validatableObj.value === "string"
  ) {
    isValid =
      isValid && validatableObj.value.length <= validatableObj.maxLength;
  }
  if (validatableObj.min != null && typeof validatableObj.value === "number") {
    isValid = isValid && validatableObj.value >= validatableObj.min;
  }
  if (validatableObj.max != null && typeof validatableObj.value === "number") {
    isValid = isValid && validatableObj.value <= validatableObj.max;
  }
  return isValid;
};
//

const AutoBind = (
  _: any,
  _2: string | Symbol,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
};


// Project State Management

class ProjectState {
  private listeners: any[] = [];
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Function) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = {
      id: Math.random().toString(),
      title: title,
      description: description,
      people: numOfPeople
    };
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();


class ProjectList
{
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: any[] = [];

  constructor(private type:'active'|'finished')
  {
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects = [];
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${ this.type }-projects`;
    projectState.addListener((projects: any[]) =>
    {
      this.assignedProjects = projects;
      this.renderProjects();
    })

    this.attach();
    this.renderContent();
  }
  private renderProjects()
  {
    const listEl = document.querySelector(`#${ this.type }-projects-list`)! as HTMLUListElement;
    for (const prjItem of this.assignedProjects)
    {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);

    }
  }
  private renderContent()
  {
    const listId = `${ this.type }-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent=`${this.type.toUpperCase()} PROJECTS`;
  }
  private attach()
  {
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }
}
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  titleElement: HTMLInputElement;
  descriptionElement: HTMLInputElement;
  peopleElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }
  private getherUserInput(): [string, string, number] | void {
    const title = this.titleElement.value;
    const description = this.descriptionElement.value;
    const people = this.peopleElement.value;
    const titleValidatable: IValidatable = { value: title, required: true };
    const descriptionValidatable: IValidatable = {
      value: description,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: IValidatable = {
      value: people,
      required: true,
      min: 1,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      console.log("Invalid Inputs, please try again later");
      return;
    } else {
      return [title, description, +people];
    }
  }

  private clearInputs() {
    this.titleElement.value = "";
    this.descriptionElement.value = "";
    this.peopleElement.value = "";
  }
  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.getherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title,description,people)
      // console.log(`Title :${ title }\nDescription : ${ description } \nPeople :${ people }`);
      
      this.clearInputs();
    }
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();

const activeProjectList = new ProjectList('active');

const finishedProjectList = new ProjectList('finished');
