ControllerCollection = Backbone.Collection.extend 
  urlRoot:"./data"
  url: ->
    this.urlRoot + '/' + this.controller + '.json'
      
class ListView extends Backbone.View
  @el: $("#Customerslist")
  render: ->
    $("#controllerlist").setTemplateElement("controller-template")
    $("#controllerlist").processTemplateURL("data/services.json")
                
AppRouter = Backbone.Router.extend
  routes:
    ":controller/:link" : "showLink"
    ":controller": "showController"
    "": "loadControllerList"
    
  showLink: (controller, link) ->
    @showController controller, (->
      path = "#" + link + "link"
      $(path).trigger "click"
      $("#" + link).collapse("show")
      $("html,body").animate
        scrollTop: $(path).offset().top, "slow"
      )
  showController: (controller, callback) ->
    @loadControllerList ->
      if @controllerList && @controllerList.controller is controller 
        callback()
      else         
        @controllerList = new ControllerCollection
        @controllerList.controller = controller
        @controllerList.fetch
          success:(models) ->
            $("#controllerDetails").setTemplateElement("controller-details-template")
            $("#controllerDetails").setParam('name', controller);
            $("#controllerDetails").processTemplate(models.toJSON()[0])
            $(".collapse").on "show", ->
              targetLink = "#" + controller + "/" + $(this).attr("id")
              app.navigate(targetLink)
            $(".arrow").click ->
              $(this).next().show ->
                if $(this).prev().hasClass("expand-arrow")
                  $(this).prev().removeClass("expand-arrow").addClass("collapse-arrow")
                else
                  $(this).prev().removeClass("collapse-arrow").addClass "expand-arrow"
            if callback 
              
              callback()                  
          error: (model, response) ->
            console.log "error Message"              
 
  loadControllerList: (callback)->
    if @controllerListView
      callback()
    else
      @controllerListView = new ListView()
      @controllerListView.render()
      if callback
        callback()
      return
    
app = new AppRouter()
Backbone.history.start()
