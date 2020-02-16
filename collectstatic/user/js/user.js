var allDataTypes;
var allDataStructures;
var fileDataTypes = ["file","files","image","photo","images","photos","video","videos","pic","pics"]
$(document).ready(function(){

	console.log("document ready");
	initialize_tooltip()
	getAllDataTypes();
	$("#add_new").click(function(){
		console.log("clciked")
		$("#myModal").modal("show")
	})


	$("#data_add_new").click(function(){
		console.log("clciked")
		$("#dataModal").modal("show")
		getAllDataStructures(function(){

		});
	})


	$("#addField").click(function(){
		limit = 50
		if($(".dataStructureRow").length >= limit){
			alert("maximum number of data types reached");
			return false;
		}
		appendFieldItem();
	})


	$("#saveData").click(function(){
		if($(".dataStructureRow").length < 1){
			addError($("#addField"),"add atleast one field")
			return false;
		}

		dataStructureName = $("#dataStructureName").val()
		if(dataStructureName == ""){
			addError($("#dataStructureName"),"Please enter a data structure name")
			return false;
		}
		fieldsOk = true;
		dataStructure = []
		$(".dataStructureRow").each(function(){

			fieldName = $(this).find(".dataStructureRowName").val()
			if(fieldName == ""){
				fieldsOk = false;
				addError($(this).find(".dataStructureRowName"),"Please enter a name for this filed")
				return false;
			}

			dataType = $(this).find(".dataStructureRowDataType").find(":selected").text();
			if(dataType == "Select Datatype"){
				addError($(this).find(".dataStructureRowDataType"), "Please select the datatype")
				fieldsOk = false;
				return false;

			}
			dataTypeId = $(this).find(".dataStructureRowDataType").find(":selected").val()
			dataStructure.push({name:fieldName,id:dataTypeId})

		})

		if(!fieldsOk){
			return false;
		}

		if($(this).hasClass("update")){
				updateDatastructure($(this).data("id"),dataStructureName,JSON.stringify(dataStructure))
		}
		else{
				saveDatastructure(dataStructureName,JSON.stringify(dataStructure));
			}

	});


	$("#data_saveData").click(function(){
		dataStructure_id = $("#dataStructureSelect").val();
		if(dataStructure_id == 0){
			addDataError($("#dataStructureSelect"),"Please choose a data structure")
			return false;
		}
		name = $("#dataName").val()
		if(name == ""){
			addDataError($("#dataName"),"Please enter a name")
			return false;
		}
		fieldsOk = true;
		dataCreated = []
		$(".dataRow").each(function(){
			
			dataName  	 = $(this).find(".dataRowName").val()
			dataTypeName = $(this).find(".dataRowDataTypeName").val()
			if(fileDataTypes.includes(dataTypeName.toLowerCase())){
				console.log("inside if") 
				dataValue 	 = $(this).find(".dataRowFile").attr("url");
				if(dataValue == "" || typeof dataValue == "undefined"){
					fieldsOk = false;
					addDataError($(this).find(".dataRowFile"),"Please choose a file")
					return false;
				}
			}
			else{
				console.log("inside else")
				dataValue 	 = $(this).find(".dataRowValue").val();
				if(dataValue == "" || typeof dataValue == "undefined"){
					console.log("inside second if")
					fieldsOk = false;
					addDataError($(this).find(".dataRowValue"),"Please enter "+dataName+" value")
					return false;
				}
			}


			if(typeof dataValue != "undefined" && typeof dataName != "undefined" && typeof dataTypeName != "undefined")
				dataCreated.push({dataName:dataName,dataValue:dataValue,dataTypeName:dataTypeName})


		})
		if(!fieldsOk){
			return false;
		}

		console.log(JSON.stringify(dataCreated))

		if($(this).hasClass("update")){
				updateData($(this).data("id"),name,JSON.stringify(dataCreated),dataStructure_id)
		}
		else{
				saveData(name,JSON.stringify(dataCreated),dataStructure_id);
			}


	})



	$("#closeModal").click(function(){
		$(".dataStructureRow").remove();
		$(".error").removeClass("error");
		$("#errorSpan").text("");
		$("#dataStructureName").val('');
		$("#saveData").text("Save")
		$("#saveData").removeClass("update")
		$("#myModal").modal("hide")

	})

	$("#data_closeModal").click(function(){
		$(".error").removeClass("error");
		$("#data_errorSpan").text("");
		$("#dataName").val('');
		$("#data_saveData").text("Save")
		$("#data_saveData").removeClass("update")
		$(".dataModalBodyContent").empty()
		$("#dataModal").modal("hide")


	})

	


	$("#delete_selected").click(function(){
		ids = []
		$(".delete_multiple:checked").each(function(){
			ids.push($(this).val());
		})
		console.log(ids)
		url  = "/datastructure/delete_multiple/"
		data = {ids:ids} 
		makesure = confirm("Are you sure you want to delete selected items?");
		if(makesure){
			sendAjax(url,data,function(data){
				console.log(data);
				if(data.result){
					$.each(ids,function(key,value){
						$("#dataStructureTableRow_"+value).remove()
					})
					appendNodataDiv();
					$("#delete_selected").hide();
				}
				else{
					alert("Something went wrong!. Please try again")
				}
			})
		}
		else{
			return false;
		}
	})


	$("#data_delete_selected").click(function(){
		ids = []
		$(".data_delete_multiple:checked").each(function(){
			ids.push($(this).val());
		})
		console.log(ids)
		url  = "/datastructure/data_delete_multiple/"
		data = {ids:ids} 
		makesure = confirm("Are you sure you want to delete selected items?");
		if(makesure){
			sendAjax(url,data,function(data){
				console.log(data);
				if(data.result){
					$.each(ids,function(key,value){
						$("#dataTableRow_"+value).remove()
					})
					appendDataNodataDiv();
					$("#delete_selected").hide();
				}
				else{
					alert("Something went wrong!. Please try again")
				}
			})
		}
		else{
			return false;
		}
	})



	$(".navItem").click(function(e){
		console.log("clicked navItem")
		e.preventDefault()
		console.log($(this).data("type"))
		type = $(this).data("type")
		$(".nav_container").hide()
		$("."+type+"_container").show()
		$(".navbar-nav").find("li").removeClass("active");
		$(this).closest("li").addClass("active")
	})


	$("#dataStructureSelect").change(function(){
		url = "/datastructure/getDataStructure/"
		data = {id:$(this).val()}
		sendAjax(url,data,function(data){
			prepareDataStructureBody(data)
		});
	})

})


$(document).on("click",".edit_data",function(){
	url = "/datastructure/getDataStructure/"
	data = {id:$(this).attr("id")}
	sendAjax(url,data,function(data){
		console.log(data);
		$("#dataStructureName").val(data.name)

		$.each(data.dataTypes,function(key,value){
			appendFieldItem(value.name,value.dataTypeName)
		})

		$("#saveData").addClass("update")
		$("#saveData").data("id",data.id)
		$("#saveData").text("update")
		$("#myModal").modal("show")
	})
})



$(document).on("click",".removeImage",function(){
	console.log($(this).closest("div"))
	$(this).closest("div").html('<input type="file" class="dataRowFile" >')
})

$(document).on("click",".data_edit_data",function(){
	url = "/datastructure/getData/"
	data = {id:$(this).attr("id")}
	sendAjax(url,data,function(data){
		dataData = JSON.parse(data.data.data)
		$("#dataName").val(data.data.name)
		$(".dataModalBodyContent").empty()
		heading = '<div class="row" style="text-align: center;font-weight: bold;"><br><div class="col-md-1"></div><div class="col-md-3">Data Name</div><div class="col-md-3">Datatype</div><div class="col-md-4">Data Value</div><div class="col-md-1"></div>'
		$(".dataModalBodyContent").append(heading);
		$.each(dataData,function(key,value){
			element = '<div class="row dataRow">'
			element += '<br>'
			element +='<div class="col-md-1"></div>'
			element +='<div class="col-md-3"><input value="'+value.dataName+'"  type="text" class="form-control dataRowName" disabled></div>'
			element +='<div class="col-md-3"><input value="'+value.dataTypeName+'"  type="text" class="form-control dataRowDataTypeName" disabled></div>'
			element +='<div class="col-md-4">'
			if(fileDataTypes.includes(value.dataTypeName.toLowerCase())){
				element += '<a type="button" class="btn btn-success dataRowFile html5lightbox" url="'+value.dataValue+'" href="'+value.dataValue+'" style="width: 50%;" target="_blank">View</a>'
				element += '<button type="button" class="btn btn-danger removeImage" style="width: 50%;float: right;">Remove</button>'
			}
			else{
				element +='<input placeholder="Enter value" value ="'+value.dataValue+'"  type="text" class="form-control dataRowValue">'
			}
			element +='</div>'
			element +='</div>'
			element +='<div class="col-md-1"></div>'
			element +='</div>'

			$(".dataModalBodyContent").append(element);
			$(".html5lightbox").html5lightbox(); 
		})
		$("#data_saveData").addClass("update")
		$("#data_saveData").data("id",data.data.id)
		$("#data_saveData").text("update")
		getAllDataStructures(function(){
			$("#dataStructureSelect").val(data.data.dataStructureId)
			$("#dataModal").modal("show")
		})
		
	})
})



$(document).on("click",".delete_data",function(){
	console.log($(this).attr("id"))
	url     = "/datastructure/delete/"
	id      = $(this).attr("id")
	data    = {id:id}

	makesure = confirm("Are you sure you want to delete this item?");
	if(makesure){
		sendAjax(url,data,function(data){
	       if(data.result){
	       	$("#dataStructureTableRow_"+id).remove()

	       	appendNodataDiv();
	       }
	       else{
	       	alert("Something went wrong!. Please try again")
	       }
		})
	}
	else{
		return false;
	}
})

$(document).on("click",".data_delete_data ",function(){
	console.log($(this).attr("id"))
	url     = "/datastructure/deleteData/"
	id      = $(this).attr("id")
	data    = {id:id}

	makesure = confirm("Are you sure you want to delete this item?");
	if(makesure){
		sendAjax(url,data,function(data){
	       if(data.result){
	       	$("#dataTableRow_"+id).remove()

	       	appendDataNodataDiv()
	       }
	       else{
	       	alert("Something went wrong!. Please try again")
	       }
		})
	}
	else{
		return false;
	}
})



$(document).on("change",".delete_multiple",function(){
	count = $(".delete_multiple:checked").length
	if(count > 0){
		$("#delete_selected").show();
	}
	else{
		$("#delete_selected").hide();
	}
})



$(document).on("change",".data_delete_multiple",function(){
	count = $(".data_delete_multiple:checked").length
	if(count > 0){
		$("#data_delete_selected").show();
	}
	else{
		$("#data_delete_selected").hide();
	}
})

$(document).on("click",".add_data",function(){
	dataStructureId = $(this).attr("id");
	getAllDataStructures(function(){
		$("#dataStructureSelect").val(dataStructureId)
		$("#dataModal").modal("show")
		$("#dataStructureSelect").change()
	})
})





$(document).on('click','.dataStructureRowRemove',function(){
	console.log("clicked")
	$(this).closest(".dataStructureRow").remove()
})


$(document).on("click","input,select,#addField",function(){

 if($(this).hasClass("error")){
 	$(this).removeClass("error");
 	$("#errorSpan").text("");
 }
})


$(document).on("change",".dataRowFile",function(){
	uploadFile($(this));
})


function uploadFile(element){
	var formData = new FormData();
	var files 	 = $(element)[0].files[0];
	formData.append('file', files); 
	formData.append("mappingId",$(element).attr("id"));
	existingButtonText = $("#data_saveData").text()
	$("#data_saveData").text("Uploading..")
	$("#data_saveData").prop('disabled', true);
	$.ajax({ 
		headers: { "X-CSRFToken": token },
        url: '/datastructure/uploadFile/', 
        type: 'post', 
        data: formData, 
        contentType: false, 
        processData: false
    }).done(function(data){
    	console.log("sucsess",data);
    	$("#data_saveData").text(existingButtonText)
    	$("#data_saveData").prop('disabled', false);
    	if(data.result){
    		element.attr("url",data.data)
    	}
    	else{
    		alert("upload failed.Please try again")
    	}

    }).fail(function(data){
    	console.log("failed",data);
    })

}

function getAllDataTypes(){
	sendAjax("/datatypes/getAllDataTypes",{},function(data){
		allDataTypes = data;
	});
}

function getAllDataStructures(callback){
	sendAjax("/datastructure/getAllDataStructures/",{},function(data){
		$("#dataStructureSelect").empty();
		element = '<option value="0">Select Datatype</option>'
		$.each(data,function(key,value){
			element += '<option  value="'+value.id+'">'+value.name+'</option>'
		})
		$("#dataStructureSelect").append(element)
		callback("ok")

	});
}

function getDataTypeSelect(dataType=""){
	element = '<option>Select Datatype</option>'
	$.each(allDataTypes,function(key,value){
		select = "";
		console.log(value.name,dataType)
		if(value.name == dataType){
			select = "selected";
		}
		element += '<option '+select+' value="'+value.id+'">'+value.name+'</option>'
	})

	return element;
}


function addError(element,errorMessage){

element.addClass("error");
$("#errorSpan").text(errorMessage);
}

function addDataError(element,errorMessage){
	element.addClass("error");
	$("#data_errorSpan").text(errorMessage);
}


function saveDatastructure(name,data){
	url  = "/datastructure/save/"
	data = {name:name,dataTypes:data}
	sendAjax(url,data,function(data){
		if(data.result){
			appendTableRow(name,data.data);
			$("#closeModal").click();
		}
		else{
			alert("Something went wrong!. Please try again");
		}
	});
}


function saveData(name,data,dataStructure_id){
	url  = "/datastructure/saveData/"
	data = {name:name,data:data,dataStructure_id:dataStructure_id}
	sendAjax(url,data,function(data){
		console.log(data)
		if(data.result){
			appendDataTableRow(name,data.id,data.dataStructureName);
			$("#data_closeModal").click();
		}
		else{
			alert("Something went wrong!. Please try again");
		}
	});
}

function updateDatastructure(id,name,data){
	url  = "/datastructure/update/"
	data = {id:id,name:name,dataTypes:data}
	sendAjax(url,data,function(data){
		if(data.result){
			$("#dataStructureTableRow_"+id).find(".row_name").text(name)
			$("#closeModal").click();
		}
		else{
			alert("Something went wrong!. Please try again");
		}
	});
}


function updateData(id,name,data,dataStructure_id){

	url  = "/datastructure/updateData/"
	console.log(data)
	ajaxdata = {id:id,name:name,data:data,dataStructure_id:dataStructure_id}
	console.log(ajaxdata)
	sendAjax(url,ajaxdata,function(response){
		if(response.result){
			console.log(response)
			$("#dataTableRow_"+id).find(".row_name").text(name)
			$("#dataTableRow_"+id).find(".row_data_structure_name").text(response.data_structure_name)
			
			$("#data_closeModal").click();
		}
		else{
			alert("Something went wrong!. Please try again");
		}
	});
}


function prepareDataStructureBody(data){
		$(".dataModalBodyContent").empty()
		heading = '<div class="row" style="text-align: center;font-weight: bold;"><br><div class="col-md-1"></div><div class="col-md-3">Data Name</div><div class="col-md-3">Datatype</div><div class="col-md-4">Data Value</div><div class="col-md-1"></div>'
		$(".dataModalBodyContent").append(heading);
		
		$.each(data.dataTypes,function(key,value){
			element = '<div class="row dataRow">'
			element += '<br>'
			element +='<div class="col-md-1"></div>'
			element +='<div class="col-md-3"><input value="'+value.name+'"  type="text" class="form-control dataRowName" disabled></div>'
			element +='<div class="col-md-3"><input value="'+value.dataTypeName+'"  type="text" class="form-control dataRowDataTypeName" disabled></div>'
			element +='<div class="col-md-4">'
			if(fileDataTypes.includes(value.dataTypeName.toLowerCase())){
				element +='<input type="file" id="'+value.mappingId+'" class="dataRowFile" name="dataRowFile_'+value.mappingId+'" >'
			}
			else{
				element +='<input placeholder="Enter value"  type="text" class="form-control dataRowValue">'
			}
			element +='</div>'
			element +='</div>'
			element +='<div class="col-md-1"></div>'
			element +='</div>'

			$(".dataModalBodyContent").append(element);
		})

}

function appendFieldItem(name="",dataType=""){
		element = '<div class="row dataStructureRow">'
		element += '<br>'
		element +='<div class="col-md-1"></div>'
		element +='<div class="col-md-5"><input placeholder="Enter Filed Name" value="'+name+'"  type="text" class="form-control dataStructureRowName"></div>'
		element +='<div class="col-md-4">'
		element +='<select class="form-control dataStructureRowDataType">'
		element += getDataTypeSelect(dataType)
		element +='</select>'
		element +='</div>'
		element += '<div class="col-md-1"><i class="fa fa-trash-o dataStructureRowRemove" style="font-size:28px;color:red;cursor: pointer;"></i></div>'
		element +='<div class="col-md-1"></div>'
		element +='</div>'

		$(".dataStructureBody").append(element);
}

function appendTableRow(name,id){
	$(".nodata_row").remove();
	element  = '<tr id="dataStructureTableRow_'+id+'">'
	element += '<td style="text-align: center;width: 15%;"><input style="zoom:1.5;" class="delete_multiple" type="checkbox" value="'+id+'"></td>'
	element += '<td class="row_name">'+name+'</td>'
	element += '<td style="text-align: center;width: 15%;">'
	element += '<i class="fa fa-edit edit_data tooltip_item"            title="edit '+name+'"          id="'+id+'" style="font-size:28px;cursor: pointer;"></i>'
	element += '&nbsp;<i class="fa fa-trash-o delete_data tooltip_item" title="delete '+name+'"        id="'+id+'" style="font-size:28px;cursor: pointer;"></i>'
	element += '&nbsp<i class="fa fa-plus-circle add_data tooltip_item" title="add data of '+name+'"   id="'+id+'" style="font-size:28px;cursor: pointer;"></i>;'
	element += '</td>'
	element += '</tr>'
	$(".dataStructureTable").append(element)
	initialize_tooltip();

}


function appendDataTableRow(name,id,dataStructureName){
	$(".data_nodata_row").remove()
	element  = '<tr id="dataTableRow_'+id+'">';
	element += '<td style="text-align: center;width: 15%;"><input style="zoom:1.5;" class="data_delete_multiple" type="checkbox" value="'+id+'"></td>'
	element += '<td class="row_name">'+name+'</td>'
	element += '<td class="row_data_structure_name">'+dataStructureName+'</td>'
	element += '<td style="text-align: center;width: 20%;">'
	element += '<i class="fa fa-edit data_edit_data tooltip_item"       title="edit '+name+'"          id="'+id+'" style="font-size:28px;cursor: pointer;"></i>'
	element += '&nbsp;'
	element += '<i class="fa fa-trash-o data_delete_data tooltip_item"  title="delete '+name+'"        id="'+id+'" style="font-size:28px;cursor: pointer;"></i>'
	element += '</td>'
	element += '</tr>'
	$("#dataTable").append(element)
	initialize_tooltip()
}

function appendNodataDiv(){
	var rowCount = $('.dataStructureTable tr').length;
	if(rowCount == 0){
		element = '<tr class="nodata_row"><td colspan="3" style="text-align: center;">No data to display</td></tr>'
		$(".dataStructureTable").append(element)
		$(".delete_selected").hide()
	}
}


function appendDataNodataDiv(){
	var rowCount = $('#dataTable tr').length;
	if(rowCount == 0){
		element = '<tr class="data_nodata_row"><td colspan="4" style="text-align: center;">No data to display</td></tr>'
		$("#dataTable").append(element)
		$("#data_delete_selected").hide()
	}
}

function initialize_tooltip(){
	$(".tooltip_item").tooltip(); 
}
