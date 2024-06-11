package com.springboot.MyTodoList.model;

public class UserState {
    private ToDoItem item;
    private int step;
    private boolean addingTask; 
    private boolean edittingTask;
    public int changedAttribute;

    public UserState() {
        this.item = new ToDoItem();
        this.step = 0;
        this.addingTask = false;
        this.edittingTask = false;
        this.changedAttribute = 0;
    }

    public ToDoItem getItem() {
        return item;
    }

    public void setItem(ToDoItem item) {
        this.item = item;
    }

    public int getStep() {
        return step;
    }

    public void setStep(int step) {
        this.step = step;
    }

    public boolean isAddingTask(){
        return this.addingTask;
    }

    public void setAddingTask(Boolean addingTask) {
        this.addingTask = addingTask;
    }

    public boolean isEdittingTask() {
        return this.edittingTask;
    }

    public void setEdittingTask(Boolean edittingTask) {
        this.edittingTask = edittingTask;
    }

}