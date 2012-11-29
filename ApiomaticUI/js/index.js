var services;
var jsonPath="http://control.qa.intercloud.net:8080/Orchestration/services/"
var currentUrl = $(location).attr('href');
var serviceName="";
//Search function
function fnSearchAndFilter()
{
	$("#search-query").keyup(function(){
		$("#services-table").find("tr").hide();
		var data = this.value.split(" ");
		var jo = $("#services-table").find("tr");
		$.each(data, function(i, v)
		{
			jo = jo.filter(function(index){
				return ($(this).children(":first").text().indexOf(data)==0);
			});
		});
		jo.show();
	}).focus(function(){
		  this.value="";
		  $(this).css({"color":"black"});
		  $(this).unbind('focus');
	}).css({"color":"#C0C0C0"});

}

//function to return the type + href for methods
function fnReturnType(obj){
	for(i in obj){
		switch(obj[i]){
			case "string":
			case "int":
				return(obj[i]);
			break;
			case "array":
				for(j in obj){
					if(j=="nestedType"){
						var ref = obj[j];
						for(k in ref){
							return ("Type is an array of <a href=\"#"+ref[k]+"\">"+ref[k]+"</a>");
						}
					}
				}
				
			break;
			default:
				return("Type is <a href=\"#"+obj[i]+"\">"+ obj[i]+"</a>");
			break;
		}
		
	}
}
//Display services page
function fnDisplayService(){
	window.location=currentUrl.substring(0,currentUrl.indexOf("?controller"));
}
//Display api details
function fnDisplayApiDetails(url){
//Hide services
	$("#indexdisplay").addClass("hide");
	$("#apiDisplay").removeClass("hide");
	

	var directive = {
		'td#mainurl':'urls',		
		'td#packageName':'packageName',
		'td.controllerdoc':'documentation',
		'tr.rowdoc@class':function(arg){
			return (arg.documentation =="" || arg.documentation ==undefined) ? "hide" : "";
		}
	}
	directiveMethod = {
		'tbody':{
			'method<-methods':{
				"tr td.consumes": "#{method.consumes}",
				'tr.rowconsumes@class':function(arg){
					return arg.item.consumes=="" ? "hide" : "";
				},
				'tr td.headers': "#{method.headers}",
				'tr.rowheaders@class':function(arg){
					return arg.item.headers=="" ? "hide" : "";
				},
				'tr td.produces': "#{method.produces}",
				'tr.rowproduces@class':function(arg){
					return arg.item.produces=="" ? "hide" : "";
				},			
				'tr td.urls a': "#{method.urls}",
				'tr td.urls a@href+': "#{method.urls}",
				'tr td.urls@id': "#{method.urls}",
				'tr.rowurls@class':function(arg){
					return arg.item.urls=="" ? "hide" : "";
				},
				'tr td.documentation': "#{method.documentation}",
				'tr.rowdoc@class':function(arg){
					return (arg.item.documentation=="" || arg.item.documentation==undefined) ? "hide" : "";
				},
				'tr td.body' : function(arg){
					return (fnReturnType(arg.item.body))
				},
				'tr.rowbody@class':function(arg){
					return (arg.item.body=="" || arg.item.body==undefined) ? "hide" : "";
				},	
				'tr td.methods': "#{method.methods}",
				'tr.rowmethods@class':function(arg){
					return arg.item.methods=="" ? "hide" : "";
				},	
				'tr td.params': "#{method.params}",	
				'tr.rowparams@class':function(arg){
					return arg.item.params=="" ? "hide" : "";
				},	
				'tr td.response' : function(arg){
					return (fnReturnType(arg.item.response))
				},
				'tr.rowresponse@class':function(arg){
					return (arg.item.response=="" || arg.item.response==undefined) ? "hide" : "";
				}

			}
		}
	};
	directiveMD={
		'div.repdiv':{
			'method<-typeDefinitions':{
				'div.type b a':function(arg){
					if(arg.item.abstractClass==true || arg.item.abstractClass=="true"){
						return (arg.item.type+" [ABSTRACT]");
					}else{
						return (arg.item.type);
					}
				},
				'div.type b a@href+':function(arg){
					return (arg.item.type);
				},
				"div.type@id":"#{method.type}",
				"div.pane@style":function(arg){
					return ('display:none');
				},
														
				'table tr td.doc':"#{method.documentation}",
				'table tr.rowdoc@class':function(arg){
					return (arg.item.documentation=="" || arg.item.documentation==undefined) ? "hide" : "";
				},
				'table tr.rowprops@class':function(arg){
					return (arg.item.properties=="" || arg.item.properties==undefined) ? "hide" : "";
				},
				'table tr.properties':{
					"property <- method.properties" : {
						"td.type": function(arg){
							switch(arg.item.type)
							{
								case "array": 
									var refObj = arg.item;
										for(j in refObj){
											if(j=="nestedType"){
												var ref = refObj[j];
												for(k in ref){
													return ("Array of <a href=\"#"+ref[k]+"\">"+ref[k]+"</a>");
												}}}			
								break;
								case "string":
								case "int":
								case "boolean":
									return (arg.item.type);
								break;
								default:
									return ("<a href=\"#"+arg.item.type+"\">"+arg.item.type+"</a>");
								break;
							}
						},
						"tr td.name+":"#{property.name}",
						"tr td.name span.required@class":function(arg){
							if(arg.item.optional==false || arg.item.optional=="false"){
								return "required";
							}else{
								return "hide";
							}
						},
						"tr td.name div.alert": function(arg){
							if(arg.item.optional==false || arg.item.optional=="false"){
								return "Required value:" + arg.item.requiredValue;
							}else{
								return "";
							}
						 }
					}
				},
				'table tr td.subclass':function(arg){
					var str = "";
					var obj = arg.item.subclasses
					if(obj !="")
					{
						for(j in obj ){
							var ref = obj[j];
							for(k in ref){
								str += "<a href=\"#"+ref[k]+"\">"+ref[k]+"</a>, ";
							}
						}
					}				
					return str;
				},
				'table tr.rowsub@class':function(arg){
					return (arg.item.subclasses=="") ? "hide" : "";
					
				},
				'table tr td.abstract':"#{method.abstractClass}",
				'table tr.rowabstract@class':function(arg){
					return (arg.item.abstractClass=="" || arg.item.abstractClass==undefined) ? "hide" : "";
				}
			}
		}
	};	
	$.getJSON(url, function(json) {
		$('table#apiTable').render(json, directive);
		$('table#methodTemplate').render(json, directiveMethod);
		$('div#typeDefinition').render(json, directiveMD);
		if(serviceName.indexOf("#")>=0){
			var anchor = (serviceName.substring(serviceName.indexOf("#"),serviceName.length));
			serviceName = serviceName.substring(0,serviceName.indexOf("#"));			
		}	
		$("#apititle").append(serviceName);	
		$(".required").hover(
			function () {
				$(this).next().removeClass('hide');
			},
			function () {
				$(this).next().addClass('hide');
			}
		);
		$(".type").click(function(){
			$(this).next().toggle();
		});
	});
}


$(document).ready(function() {
	//check the url for ?controller
	if(currentUrl.indexOf("?controller")>=0){
		serviceName = currentUrl.substring(currentUrl.indexOf("=")+1,String(currentUrl).length);		
		var url = jsonPath+serviceName;
		fnDisplayApiDetails(url);
	}else{		
		var directive = {
			'tbody tr':{
				'services<-services':{
					"td.name a": "#{services.name}",
					"td.baseURL": "#{services.baseUrl}",
					"td.documentation": "#{services.documentation}"
				}
			}
		};	
		$.getJSON(jsonPath, function(json) {
			var jsObj = null;
			jsObj = {"services":json};
			$('table#services-table').render(jsObj, directive);
			fnSearchAndFilter();
			//define the click function for service name
			$('td.name a').click(function(){
				serviceName = $(this).html();
				window.location=currentUrl+"?controller="+$(this).html();			
			});		
		});
	}	
	
});