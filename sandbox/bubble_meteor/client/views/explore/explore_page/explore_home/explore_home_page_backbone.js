Template.explorePageBackbone.created = function(){

}



Template.explorePageBackbone.rendered = function(){
	//var currentExploreId = window.location.pathname.split("/")[2];
	currentExploreId = 'pxmgzT74iwBbadvyp';
	es = new BubbleData.ExploreSection({
		exploreId: currentExploreId,
		limit: 10,
		fields: ['name', 'author', 'postAsType', 'postAsId', 'submitted']
	});
}