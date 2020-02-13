var allDataTypes;


$(document).ready(function(){
	console.log("document ready");
	getAllDataTypes();
	$("#add_new").click(function(){
		console.log("clciked")
		$("#myModal").modal("show")
	})


	$("#addField").click(function(){
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



	$("#closeModal").click(function(){
		$(".dataStructureRow").remove();
		$(".error").removeClass("error");
		$("#errorSpan").text("");
		$("#dataStructureName").val('');
		$("#saveData").text("Save")
		$("#saveData").removeClass("update")
		$("#myModal").modal("hide")

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

$(document).on("change",".delete_multiple",function(){
	count = $(".delete_multiple:checked").length
	if(count > 0){
		$("#delete_selected").show();
	}
	else{
		$("#delete_selected").hide();
	}
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


function getAllDataTypes(){
	sendAjax("/datatypes/getAllDataTypes",{},function(data){
		allDataTypes = data;
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

		$(".modal-body").append(element);
}

function appendTableRow(name,id){
	$(".nodata_row").remove();
	element  = '<tr id="dataStructureTableRow_'+id+'">'
	element += '<td style="text-align: center;width: 15%;"><input style="zoom:1.5;" class="delete_multiple" type="checkbox" value="'+id+'"></td>'
	element += '<td class="row_name">'+name+'</td>'
	element += '<td style="text-align: center;width: 15%;">'
	element += '<i class="fa fa-edit edit_data"      id="'+id+'" style="font-size:28px;cursor: pointer;"></i>'
	element += '<i class="fa fa-trash-o delete_data" id="'+id+'" style="font-size:28px;cursor: pointer;"></i>'
	element += '</td>'
	element += '</tr>'
	$("tbody").append(element)

}

function appendNodataDiv(){
	var rowCount = $('tbody tr').length;
	if(rowCount == 0){
		element = '<tr class="nodata_row"><td colspan="3" style="text-align: center;">No data to display</td></tr>'
		$("tbody").append(element)
	}
}