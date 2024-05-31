package com.springboot.MyTodoList.model;

public class UserState {
    private ToDoItem item;
    private int step;
    private boolean addingToDo; 

    public UserState() {
        this.item = new ToDoItem();
        this.step = 0;
        this.addingToDo = false;
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

    public boolean isAddingToDo(){
        return this.addingToDo;
    }

    public void setAddingtoDo(Boolean addingToDo) {
        this.addingToDo = addingToDo;
    }

}