package com.springboot.MyTodoList.util;

public enum BotLabels {
	
	SHOW_MAIN_SCREEN("🤖Menu principal🤖"), 
	HIDE_MAIN_SCREEN("⬇️Ocultar menu principal⬇️"),
	LIST_ALL_ITEMS("🗒Mostrar todas las Tasks🗒"), 
	ADD_NEW_ITEM("🆕Crear Task🆕"),
	DONE("✅"),
	UNDO("DESHACER⤴️"),
	DELETE("BORRAR❌"),
	MY_TODO_LIST("🧑‍💻MIS DEVOPS TASKS🧑‍💻"),
	DASH("-");

	private String label;

	BotLabels(String enumLabel) {
		this.label = enumLabel;
	}

	public String getLabel() {
		return label;
	}

}
