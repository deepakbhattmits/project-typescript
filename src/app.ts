//


const AutoBind = (_: any, _2: string | Symbol, descriptor: PropertyDescriptor) =>
{
    const originalMethod = descriptor.value;
    const adjDescriptor:PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get()
        {
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }
    return adjDescriptor;
}

class ProjectInput
{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;

    titleElement: HTMLInputElement;
    descriptionElement: HTMLInputElement;
    peopleElement: HTMLInputElement;

    constructor()
    {
        
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement 
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.attach();
    }
    private getherUserInput():[string,string,number]|void{
        const title = this.titleElement.value;
        const description = this.descriptionElement.value;
        const people = this.peopleElement.value;
        if (title.trim().length === 0 || description.trim().length === 0 || people.trim().length === 0)
        {
            console.log('Invalid Inputs, please try again later');
            return;
        } else
        {
            return  [title, description, +people];
        }
    }

    private clearInputs()
    {
        this.titleElement.value = '';
        this.descriptionElement.value = '';
        this.peopleElement.value = '';
    }
    @AutoBind
    private submitHandler(event:Event)        {
        event.preventDefault();
        const userInput = this.getherUserInput();
        if (Array.isArray(userInput))
        {
            const [title, description, people] = userInput;
            console.log(title, description, people)
            this.clearInputs()
        }
    }
    
    private configure()
    {
        this.element.addEventListener('submit', this.submitHandler)
    }
    private attach()
    {
        this.hostElement.insertAdjacentElement('afterbegin',this.element)
    }
}

const prjInput = new ProjectInput();