if(typeof(Npm) != "undefined") {
    Profiler = Npm.require("webkit-devtools-agent");
}
else
{
    console.log("Please upgrade meteor to 0.6.0")
    Profiler = __meteor_bootstrap__.require("webkit-devtools-agent");
}
