package com.springboot.MyTodoList.controller;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.ws.rs.Priorities;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.ToDoItemService;
import com.springboot.MyTodoList.util.BotCommands;
import com.springboot.MyTodoList.util.BotHelper;
import com.springboot.MyTodoList.util.BotLabels;
import com.springboot.MyTodoList.util.BotMessages;

public class ToDoItemBotController extends TelegramLongPollingBot {

	private static final Logger logger = LoggerFactory.getLogger(ToDoItemBotController.class);
	private ToDoItemService toDoItemService;
	private String botName;

	public ToDoItemBotController(String botToken, String botName, ToDoItemService toDoItemService) {
		super(botToken);
		logger.info("Bot Token: " + botToken);
		logger.info("Bot name: " + botName);
		this.toDoItemService = toDoItemService;
		this.botName = botName;
	}

	@Override
	public void onUpdateReceived(Update update) {

		if (update.hasMessage() && update.getMessage().hasText()) {

			String messageTextFromTelegram = update.getMessage().getText();
			long chatId = update.getMessage().getChatId();
			long user_id = update.getMessage().getChat().getId();

			if (messageTextFromTelegram.equals(BotCommands.START_COMMAND.getCommand())
					|| messageTextFromTelegram.equals(BotLabels.SHOW_MAIN_SCREEN.getLabel())) {

				SendMessage messageToTelegram = new SendMessage();
				messageToTelegram.setChatId(chatId);
				// messageToTelegram.setText(BotMessages.HELLO_MYTODO_BOT.getMessage() + "Hola dev:" + String.valueOf(user_id));

				ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
				List<KeyboardRow> keyboard = new ArrayList<>();

				// first row
				KeyboardRow row = new KeyboardRow();
				row.add(BotLabels.LIST_ALL_ITEMS.getLabel());
				row.add(BotLabels.ADD_NEW_ITEM.getLabel());
				// Add the first row to the keyboard
				keyboard.add(row);

				// second row
				row = new KeyboardRow();
				row.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				row.add(BotLabels.HIDE_MAIN_SCREEN.getLabel());
				keyboard.add(row);

				// Set the keyboard
				keyboardMarkup.setKeyboard(keyboard);

				// Add the keyboard markup
				messageToTelegram.setReplyMarkup(keyboardMarkup);

				try {
					execute(messageToTelegram);
				} catch (TelegramApiException e) {
					logger.error(e.getLocalizedMessage(), e);
				}
				
				//VER LOS DETALLES DE UN TODO, SE UTILIZA EL EMOJI DEL DIAMANTE PARA IDENTIFICAR ESTA ACCIÓN
			} else if (messageTextFromTelegram.indexOf(BotLabels.TODO_DETAILS.getLabel()) != -1) {
				
				String todoSelected = messageTextFromTelegram.substring(0,messageTextFromTelegram.indexOf(BotLabels.DASH.getLabel()));
				Integer todoId = Integer.valueOf(todoSelected);

				try {

					ToDoItem item = getToDoItemById(todoId).getBody();

					String priority;
					switch (item.getPriority()) {
						case 1:
							priority = "🟥 ALTA";
							break;
						case 2:
							priority = "🟧 MEDIA";
							break;
						case 3:
							priority = "🟨 BAJA";
							break;
						default:
							priority = "INDEFINIDA";
					}

					String complexity;
					switch (item.getComplexity()) {
						case 1:
							complexity = "😎 BAJA";
							break;
						case 2:
							complexity = "🤨 MEDIA";
							break;
						case 3:
							complexity = "😨 ALTA";
							break;
						default:
							complexity = "INDEFINIDA";
					}

					String status; 
					if (item.isDone()) {
						status = "Completada ⛳️"; 
					} else {
						status = "En progreso 🛠️"; 
					}

					SendMessage messageToTelegram1 = new SendMessage();
					messageToTelegram1.setChatId(chatId);
					messageToTelegram1.setText( "Claro! A continuación te muestro los detalles de tu task!");
					ReplyKeyboardRemove keyboardMarkup1 = new ReplyKeyboardRemove(true);
					messageToTelegram1.setReplyMarkup(keyboardMarkup1);
					execute(messageToTelegram1);

					SendMessage messageToTelegram = new SendMessage();
					messageToTelegram.setChatId(chatId);
					messageToTelegram.setText( "Título: " + item.getDescription()+ ", " + "\nDescripción: " + " " + item.getDetails() + ", " + "\nPrioridad: " + priority + ", " + "\nComplejidad: " + complexity + ", " + " \nEstatus: " + status);
					ReplyKeyboardRemove keyboardMarkup = new ReplyKeyboardRemove(true);
					messageToTelegram.setReplyMarkup(keyboardMarkup);
					execute(messageToTelegram);

				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}
			
			} else if (messageTextFromTelegram.indexOf(BotLabels.DONE.getLabel()) != -1) {

				String done = messageTextFromTelegram.substring(0,
						messageTextFromTelegram.indexOf(BotLabels.DASH.getLabel()));
				Integer id = Integer.valueOf(done);

				try {

					ToDoItem item = getToDoItemById(id).getBody();
					item.setDone(true);
					updateToDoItem(item, id);
					BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DONE.getMessage(), this);

				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}

			} else if (messageTextFromTelegram.indexOf(BotLabels.UNDO.getLabel()) != -1) {

				String undo = messageTextFromTelegram.substring(0,
						messageTextFromTelegram.indexOf(BotLabels.DASH.getLabel()));
				Integer id = Integer.valueOf(undo);

				try {

					ToDoItem item = getToDoItemById(id).getBody();
					item.setDone(false);
					updateToDoItem(item, id);
					BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_UNDONE.getMessage(), this);

				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}

			} else if (messageTextFromTelegram.indexOf(BotLabels.DELETE.getLabel()) != -1) {

				String delete = messageTextFromTelegram.substring(0,
						messageTextFromTelegram.indexOf(BotLabels.DASH.getLabel()));
				Integer id = Integer.valueOf(delete);

				try {

					deleteToDoItem(id).getBody();
					BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DELETED.getMessage(), this);

				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}

			} else if (messageTextFromTelegram.equals(BotCommands.HIDE_COMMAND.getCommand())
					|| messageTextFromTelegram.equals(BotLabels.HIDE_MAIN_SCREEN.getLabel())) {

				BotHelper.sendMessageToTelegram(chatId, BotMessages.BYE.getMessage(), this);

			//LISTAR TODOS LOS TODOS 
			} else if (messageTextFromTelegram.equals(BotCommands.TODO_LIST.getCommand())
					|| messageTextFromTelegram.equals(BotLabels.LIST_ALL_ITEMS.getLabel())
					|| messageTextFromTelegram.equals(BotLabels.MY_TODO_LIST.getLabel())) {
				
				//AGREGAR SEGREGACION
				List<ToDoItem> allItems = getAllToDoItems();

				ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
				List<KeyboardRow> keyboard = new ArrayList<>();

				// command back to main screen
				KeyboardRow mainScreenRowTop = new KeyboardRow();
				mainScreenRowTop.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				keyboard.add(mainScreenRowTop);

				KeyboardRow firstRow = new KeyboardRow();
				firstRow.add(BotLabels.ADD_NEW_ITEM.getLabel());
				keyboard.add(firstRow);

				KeyboardRow myTodoListTitleRow = new KeyboardRow();
				myTodoListTitleRow.add(BotLabels.MY_TODO_LIST.getLabel());
				keyboard.add(myTodoListTitleRow);

				List<ToDoItem> activeItems = allItems.stream().filter(item -> item.isDone() == false && (String.valueOf(user_id).equals(item.getIdAssignee())))
						.collect(Collectors.toList());

				for (ToDoItem item : activeItems) {

					KeyboardRow currentRow = new KeyboardRow();
					// currentRow.add(item.getDescription());
					String prio = "";
					String comp = "";
					if(item.getPriority() <= 1) {
						prio = "🟥";
					} else if(item.getPriority() == 2) {
						prio = "🟧";
					} else if(item.getPriority() >= 3) {
						prio = "🟨";
					}
					if(item.getComplexity() <= 1) {
						comp = "😎";
					} else if(item.getComplexity() == 2) {
						comp = "🤨";
					} else if(item.getComplexity() >= 3) {
						comp = "😰";
					}
					// currentRow.add("Prioridad: " + prio + ", Complejidad: " + comp);
					currentRow.add(item.getID() + BotLabels.DASH.getLabel() + BotLabels.TODO_DETAILS.getLabel() + item.getDescription() + " | Prioridad: " + prio + " | Complejidad: " + comp);
					currentRow.add(item.getID() + BotLabels.DASH.getLabel() + BotLabels.DONE.getLabel());
					keyboard.add(currentRow);
				}

				List<ToDoItem> doneItems = allItems.stream().filter(item -> item.isDone() == true && (String.valueOf(user_id).equals(item.getIdAssignee())))
						.collect(Collectors.toList());

				for (ToDoItem item : doneItems) {
					KeyboardRow currentRow = new KeyboardRow();
					String prio = "";
					String comp = "";
					if(item.getPriority() <= 1) {
						prio = "🟥";
					} else if(item.getPriority() == 2) {
						prio = "🟧";
					} else if(item.getPriority() >= 3) {
						prio = "🟨";
					}
					if(item.getComplexity() <= 1) {
						comp = "😎";
					} else if(item.getComplexity() == 2) {
						comp = "🤨";
					} else if(item.getComplexity() >= 3) {
						comp = "😰";
					}
					// currentRow.add("Prioridad: " + prio + ", Complejidad: " + comp);
					currentRow.add(item.getID() + BotLabels.DASH.getLabel() + BotLabels.TODO_DETAILS.getLabel() + item.getDescription() + " | Prioridad: " + prio + " | Complejidad: " + comp);
					currentRow.add(item.getID() + BotLabels.DASH.getLabel() + BotLabels.UNDO.getLabel());
					currentRow.add(item.getID() + BotLabels.DASH.getLabel() + BotLabels.DELETE.getLabel());
					keyboard.add(currentRow);
				}

				// command back to main screen
				KeyboardRow mainScreenRowBottom = new KeyboardRow();
				mainScreenRowBottom.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				keyboard.add(mainScreenRowBottom);

				keyboardMarkup.setKeyboard(keyboard);

				SendMessage messageToTelegram = new SendMessage();
				messageToTelegram.setChatId(chatId);
				messageToTelegram.setText(BotLabels.MY_TODO_LIST.getLabel());
				messageToTelegram.setReplyMarkup(keyboardMarkup);

				try {
					execute(messageToTelegram);
				} catch (TelegramApiException e) {
					logger.error(e.getLocalizedMessage(), e);
				}
			
				// AGREGAR NUEVO ITEM
			} else if (messageTextFromTelegram.equals(BotCommands.ADD_ITEM.getCommand())
					|| messageTextFromTelegram.equals(BotLabels.ADD_NEW_ITEM.getLabel())) {
				try {
					SendMessage messageToTelegram = new SendMessage();
					messageToTelegram.setChatId(chatId);
					messageToTelegram.setText(BotMessages.TYPE_NEW_TODO_ITEM.getMessage());
					// hide keyboard
					ReplyKeyboardRemove keyboardMarkup = new ReplyKeyboardRemove(true);
					messageToTelegram.setReplyMarkup(keyboardMarkup);

					// send message
					execute(messageToTelegram);

				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}

			}

			else {
				try {
					ToDoItem newItem = new ToDoItem();
					String[] array = messageTextFromTelegram.split(";");
					int i = 0;
					for (String palabra : array) {
						if(i == 0) {
							newItem.setDescription(palabra);
						} else if (i == 1) {
							newItem.setDetails(palabra);
						} else if (i == 2) {
							int prioridad = Integer.valueOf(palabra.strip());
							newItem.setPriority(prioridad);
						} else if (i == 3) {
							int complejidad = Integer.valueOf(palabra.strip());
							newItem.setComplexity(complejidad);
						}
						i = i + 1;
					}
					newItem.setCreation_ts(OffsetDateTime.now());
					newItem.setDone(false);
					newItem.setIdAssignee(String.valueOf(user_id));
					ResponseEntity entity = addToDoItem(newItem);

					SendMessage messageToTelegram = new SendMessage();
					messageToTelegram.setChatId(chatId);
					messageToTelegram.setText(BotMessages.NEW_ITEM_ADDED.getMessage());

					execute(messageToTelegram);
				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}
			}
		}
	}

	@Override
	public String getBotUsername() {		
		return botName;
	}

	// GET /todolist
	public List<ToDoItem> getAllToDoItems() { 
		return toDoItemService.findAll();
	}

	// public List<ToDoItem> getAllDevItems(long devID) {
	// 	return toDoItemService.findAllDevItems(devID)
	// }

	// GET BY ID /todolist/{id}
	public ResponseEntity<ToDoItem> getToDoItemById(@PathVariable int id) {
		try {
			ResponseEntity<ToDoItem> responseEntity = toDoItemService.getItemById(id);
			return new ResponseEntity<ToDoItem>(responseEntity.getBody(), HttpStatus.OK);
		} catch (Exception e) {
			logger.error(e.getLocalizedMessage(), e);
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	// PUT /todolist
	public ResponseEntity addToDoItem(@RequestBody ToDoItem todoItem) throws Exception {
		ToDoItem td = toDoItemService.addToDoItem(todoItem);
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("location", "" + td.getID());
		responseHeaders.set("Access-Control-Expose-Headers", "location");
		// URI location = URI.create(""+td.getID())

		return ResponseEntity.ok().headers(responseHeaders).build();
	}

	// UPDATE /todolist/{id}
	public ResponseEntity updateToDoItem(@RequestBody ToDoItem toDoItem, @PathVariable int id) {
		try {
			ToDoItem toDoItem1 = toDoItemService.updateToDoItem(id, toDoItem);
			System.out.println(toDoItem1.toString());
			return new ResponseEntity<>(toDoItem1, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(e.getLocalizedMessage(), e);
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		}
	}

	// DELETE todolist/{id}
	public ResponseEntity<Boolean> deleteToDoItem(@PathVariable("id") int id) {
		Boolean flag = false;
		try {
			flag = toDoItemService.deleteToDoItem(id);
			return new ResponseEntity<>(flag, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(e.getLocalizedMessage(), e);
			return new ResponseEntity<>(flag, HttpStatus.NOT_FOUND);
		}
	}

}