/**
    THIS IS THE SCRIPT FOR THE 3D VISUAL.
    ------ FUNCTIONS ------
    INIT()
    GETRESULT() RETURN STRING[]
    LIMITCHECK() RETURN BOOL
    SETUP()
    GETLENGTH(STRING) RETURN NUMBER
    FIRST(STRING[], INT) RETURN DATA
    SECOND(DATA, STRING, INT) RETURN NUMBER
    SURVIVEDLEGEND()
    PROCESSDATA(DATA, NUMBER)
    DRAGSTART()
    DRAGGED()
    DRAGEND()
    MAKECUBE(NUMBER, NUMBER, NUMBER) RETURN VERTEX[]
**/






        // ---------------------- IMAGE VARIABLES -------------------------
        console.log("Starting the script")

        var svg2 = d3.select('#svg2');

        var svg = d3.select('svg') // SELECTS IN HTML LOCATION OF IMAGE
            .call(d3.drag() // ENVOKES FUNCTION EXACTLY ONCE IN THIS CASE, THE DRAG FUNCTION WHICH CREATES NEW DRAG BEHAVIOR
            // EVENTS: ON START OF DRAG, DRAGGING, AND END OF DRAG
                .on('drag', dragged)
                .on('start', dragStart)
                .on('end', dragEnd))
            .append('g') // APPENDS G ELEMENT TO SVG (G ELEMENT USED TO GROUP SVG SHAPES TOGETHER)
            .attr("preserveAspectRatio", "xMinYMin meet") // ALLOWS UNIFORM SCALING FOR BOTH X AND Y USING VALUES IN VIEWBOX AS A BASE
            .attr("viewBox", "0 0 600 400") // VIEWBOX ATTRIBUTE MAKES SVG SCALABLE WITH ORIGIN AT 0,0 AND WIDTH 600, HEIGHT 400
            .classed("svg-content-responsive", true); // INSURES THE SVG IS CONTAINED WITHIN THE DIV

        var origin = [505, 300], // THE LOCATION OF THE CENTER OF THE 3D IMAGE
            scale = 10, // USED TO SCALE THE OBJECT TO SIZE OF IMAGE: CHANGED FROM 20 TO 10 
            startAngle = Math.PI / 6,
            // NEW VARIABLES FOR USE IN GRID
            yLine = [],
            xLine = [],
            xLabel = [],
            yLabel = [];

        // FOR USE IN LEGEND
        var group = null;

        // USED FOR CLICK EVENTS
        var selected = [];
        var arraySize = 0;






        // ------------------------ DATA VARIABLES ---------------------------

        var datas; // THE DATA TO BE USED IN VISUALIZATION

        var cubes3D = d3._3d()
            .shape('CUBE') // TYPE OF SHAPE IN THIS CASE A CUBE
            .x(function (d) { return d.x; }) // LOCATION OF POINT ON X-AXIS
            .y(function (d) { return d.y; }) // LOCATION OF POINT ON Y-AXIS
            .z(function (d) { return d.z; }) // LOCATION OF POINT ON Z-AXIS
            .rotateY(startAngle) // ROTATION OF CUBES ON X-AXIS
            .rotateX(-startAngle) // ROTATION OF CUBES ON Y-AXIS
            .origin(origin) // POSITIONS OBJECT IN 3D AREA AROUND ORIGIN
            .scale(scale); // FITS SIZE OF SHAPE TO IMAGE






        // ------------------------ GRID VARIABLES ---------------------------

        var yScale3d = d3._3d()
            .shape('LINE_STRIP')
            .origin(origin)
            .rotateY(startAngle)
            .rotateX(-startAngle)
            .scale(scale);

        var xScale3d = d3._3d()
            .shape('LINE_STRIP')
            .origin(origin)
            .rotateY(startAngle)
            .rotateX(-startAngle)
            .scale(scale);






        // ------------------------ OTHER VARIABLES ---------------------------

        var color = d3.scaleOrdinal(d3.schemeCategory20); // AN ARRAY OF 20 COLORS REPRESENTED AS HEX NUMBERS WITHIN AN ORDINAL SCALE OBJECT
        var cubesGroup = svg.append('g').attr('class', 'cubes'); // ASSIGNS ATTRIBUTE TO G OBJECT, IN THIS CASE CLASS=CUBES

        // THE VARIABLES USED IN THE DRAG FUNCTIONS
        var mx, // X POSITION OF MOUSE
            my, // Y POSITION OF MOUSE
            mouseX, // X PSOITION OF DRAGGED MOUSE
            mouseY, // Y POSITION OF DRAGGED MOUSE
            alpha = 0,
            beta = 0;
        var checkinput = 0;






        //****************** START OF PROCESSING JSON *********************


        // ------------------------ VARIABLES ---------------------------
        var personnel = [], // AN ARRAY CONTAINING INFORMATION/YEAR
            yearData = {}, // CREATES AN OBJECT YEARDATA (NOT AN ARRAY)
            // DATA IDENTIFIERS
            inst = 'all',
            role = 'faculty',
            fs = 'Total',
            year = 8,
            datatype = 0;

        // VARIABLES FOR LOOP
        // CAN BE FOUND IN PROCESS DATA FOR MORE FLEXIBILITY
        var years;
        var fields = ['FS_Life_sciences',
                      'FS_Mathematics_and_computer_sciences',
                      'FS_Physical_sciences_and_earth_sciences',
                      'FS_Psychology_and_social_sciences',
                      'FS_Engineering',
                      'FS_Education',
                      'FS_Humanities_and_arts',
                      'FS_Others',
                      'Total'];
        var fields_names = ['Life Sciences',
                      'Mathematics and Computer Sciences',
		      'Physical Sciences and Earth Sciences',
                      'Psychology and Social Sciences',
                      'Engineering',
                      'Education',
                      'Humanities and Arts',
                      'Others',
                      'Total'];
        var institution = ['r1',
                           'fourYear',
                           'twoYear',
                           'all'];
        var faculty = ['faculty',
                       'nonfaculty',
                       'postdoc'];
        // ------------------------ VARIABLES END ---------------------------






        d3.json("dataN.json", function (d) { // DATA.JSON IS PASSED INTO FUNCTION THROUGH PARAM d

            console.log("I'm in ")

            years = "2007 2010 2011 2012 2013 2014 2015 2016 2017".split(" ") // CREATES ARRAY YEARS
            const numYears = years.length // SIZE OF YEARS

            console.log('numYears= '+numYears)

            for (var i = 0; i < numYears; i++) { // LOOPS THROUGH THE ARRAY YEARS

                if (i > 20) alert("stop")

                const year = years[i] // CURRENT YEAR

                // OBTAIN INFORMATION FROM JSON
                yearData = {
                    r1: {
                        faculty: d[0][0][year],
                        nonfaculty: d[0][1][year],
                        postdoc: d[0][2][year]
                    },
                    fourYear: {
                        faculty: d[1][0][year],
                        nonfaculty: d[1][1][year],
                        postdoc: d[1][2][year]
                    },
                    twoYear: {
                        faculty: d[2][0][year],
                        nonfaculty: d[2][1][year],
                        postdoc: d[2][2][year]
                    },
                    all: {
                        faculty: d[3][0][year],
                        nonfaculty: d[3][1][year],
                        postdoc: d[3][2][year]
                    },
                    Year: year
                }
		console.log(`i=${i} year=${year}`)
		console.log(JSON.stringify(yearData,2))
                personnel.push(yearData)
            }

            //console.log(yearData.r1.faculty)
            //console.log("my year data is:", inst);
            //console.log("Trying out the variables", yearData[inst][role][fs])
            console.log("I'm out")
        })

        //****************** END OF PROCESSING JSON *********************






        /**
        * THIS IS A FUNCTION CALLED INIT
        * IT CREATES THE CUBE AND DRAWS THE SVG
        **/
        function init() {
            
            if (group != null) group.remove();

            //******* CREATE THE CUBES AND PUSH THEM ********
            
            // ARRAYS OF ELEMENTS FOR EACH OBJECT IN THE IMAGE
            // VERTICES
            cubesData = [];
            yLine = [];
            xLine = [];
            // STRING
            xLabel = [];
            yLabel = [];

            // CUBE VARIABLES; ID, COLOR, ATTRIBUTE
            var cnt = 0;
            var ycolor;
            var xattr;

            // DATA VARIABLES; USER CHOICE, LENGTH OF DATA VARIABLES
            var results = getResult();
            var q = getLength(results[0]);
            var p = getLength(results[1]);
            
            var con = [];

            for (var z = 0; z < q; z++) {
                
                firstData = first(results, z); // OBTAIN FIRST VARIABLE'S DATA
                xattr = xLabel[z] // RETRIEVE X LABEL FOR THE CURRENT CUBE
                //console.log("ITS OVER HERE");
                
                for (var x = 0; x < p; x++) {
                    
                    secData = second(firstData, results[1], x); // OBTAIN SECOND VARIABLE'S DATA

                    // ------------------------ CUBE ------------------------------
                    
                    var y = parseFloat((-1 * (secData) / 10000).toFixed(5)); // NUMBER OF DIGITS TO APPEAR AFTER DECIMAL POINT = 5
                    var a = 5 * x - 5*(p/2); // ADJUST SIZE
                    var b = 5 * z - 5*(q/2); // ADJUST SIZE
                    
                    if(datatype == 1){
                        if(z == 0){
                            con.push(y);
                        } else{
                            // CALCULATIONS FOR GROWTH GO HERE
                            // USE THE VALUES IN CON AND THE Y VALUE
                            // TO CALCULATE THE NEW Y FOR GROWTH
                        }
                    }

                    var _cube = makeCube(a, y, b); // MAKE THE CUBE USING BASE (X,Y,Z)
                    _cube.id = 'cube_' + cnt++; // THE NAME OF THE CUBE i.e cube_1
                    _cube.height = y; // RECORDS THE HEIGHT OF THE CUBE
                    ycolor = yLabel[x];
                    //console.log("ARE WE UNDEFINES?", yLabel)
                    _cube.ycolor = ycolor;
                    _cube.xattr = xattr;
                    cubesData.push(_cube); // ADDS CUBE TO ARRAY
                    
                    // ------------------------ LINES ------------------------------
                    
                    var x_line_edge = 5 * (p - 1)- 5*(p/2) + 5;
                    var y_line_edge = 5 * (q - 1)- 5*(q/2) + 5;

                    xLine.push([x_line_edge, 1, b]);
                    yLine.push([a, 1, y_line_edge]);
                }

            }
            //console.log(cubesData.length);

            var allData = [
                cubes3D(cubesData),
                yScale3d([yLine]),
                xScale3d([xLine]),
            ];
            survivedLegend();

            //console.log(">>>>>>>>>>>> xLabel: ", xLabel);
            //console.log(">>>>>>>>>>>> yLabel: ", yLabel);
            processData(allData, 1000); // DRAW THE SVG
        }






        /**
        * THIS IS A FUNCTION CALLED GETRESULT
        * IT OBTAINS THE USER INPUT FROM CHECKBOXES
        * IT RETURNS AN ARRAY OF STRINGS OF TWO VARIABLES
        * OR NULL IF TWO CHOICES WERE NOT MADE
        **/
        function getResult() {
            var x = document.getElementsByName('variable'); // GET THE HTML OBJECT
            var res = []; // ARRAY TO HOLD RESPONSES
            var g = 0; // COUNTS BOXES THAT HAVE BEEN CHECKED
            for (var i = 0; i < x.length; i++) {
                if (x[i].checked == true) { // IF THE CHECKBOX IS CHECKED
                    res[g] = x[i].value; // ADD IT TO THE ARRAY
                    g++;
                }
            }
            if (res.length == 2) {
                return res;
            } else {
                return null;
            }
        }






        /**
        * THIS IS A FUNCTION CALLED LIMIT CHECK
        * IT LIMITS THE NUMBER OF CHECKBOXES THAT CAN BE CHECKED AT A TIME
        * ONLY 2 BOXES CAN BE CHECKED
        **/
        function limitCheck(){
            var a = document.getElementsByName('variable'); // GET HTML OBJECT
            var newvar = 0;
            for(var count=0; count<a.length; count++){
                if(a[count].checked==true){
                    newvar=newvar+1;
                }
            }
            if(newvar>2){
                return false;
            }
            checkinput = newvar;
        }






        /**
        * THIS IS A FUNCTION CALLED SETUP
        * IT MAKES CERTAIN RADIOBOXES VISIBLE DEPENDING ON INPUT
        **/
        function setUp(){
            var d1 = document.getElementById("instbuttons");
            var d2 = document.getElementById("staffbuttons");
            var d3 = document.getElementById("fieldbuttons");
            var d4 = document.getElementById("yearbuttons");
            var d5 = document.getElementById("warning");
            var d6 = document.getElementById("image");
            var d7 = document.getElementById("valuebuttons");
            var x = document.getElementsByName('variable');

            if(checkinput==2){
               if(x[0].checked==false){ //years
                    d4.style.display = "block"
                    d7.style.display = "none"
                    datatype = 0
                } else{
                    d4.style.display = "none"
                    d7.style.display = "block"
                }
                if(x[1].checked==false){ //inst
                    d1.style.display = "block"
                } else{
                    d1.style.display = "none"
                }
                if(x[2].checked==false){ //staff
                    d2.style.display = "block"
                } else{
                    d2.style.display = "none"
                }
                if(x[3].checked==false){ //fields
                    d3.style.display = "block"
                } else{
                    d3.style.display = "none"
                }
                d6.style.display = "block";
                d5.style.display = "none";
                init();
            } else{
                d5.style.display = "block"
                d1.style.display = "none"
                d2.style.display = "none"
                d3.style.display = "none"
                d4.style.display = "none"
                d6.style.display = "none"
                d7.style.display = "none"
            }
        }






        /**
        * THIS IS A FUNCTION CALLED GETLENGTH
        * IT TAKES A STRING NAME OF DATA AS INPUT
        * AND RETURNS THE SIZE OF THE DATA
        **/
        function getLength(result) {
            if (result.localeCompare("institution") == 0) {
                return institution.length;
            }
            if (result.localeCompare("staff") == 0) {
                return faculty.length;
            }
            if (result.localeCompare("fields") == 0) {
                return fields.length;
            }
            if (result.localeCompare("years") == 0) {
                return years.length;
            }
        }






        /**
        * THIS IS A FUNCTION CALLED FIRST
        * IT FINDS THE DATA ASSOCIATED WITH THE FIRST CHOSEN VARIABLE
        * AND RETURNS IT BASED ON THE SECOND VARIABLE
        * IT TAKES A STRING ARRAY OF VARIABLE NAMES
        * AND A NUMBER Z
        **/
        function first(result, z) {
            if (result[0].localeCompare("years") == 0) {
                xLabel = years;
                if (result[1].localeCompare("staff") == 0) {
                    yLabel = faculty;
                    return personnel[z][inst]
                }
                if (result[1].localeCompare("fields") == 0) {
                    yLabel = fields_names;
                    return personnel[z][inst][role]
                }
                return personnel[z];
            }
            if (result[0].localeCompare("institution") == 0) {
                xLabel = institution;
                if (result[1].localeCompare("fields") == 0) {
                    yLabel = fields_names;
                    return personnel[year][institution[z]][role]
                }
                return personnel[year][institution[z]]
            }
            if (result[0].localeCompare("staff") == 0) {
                xLabel = faculty;
                return personnel[year][inst][role]
            }
        }






        /**
        * THIS IS A FUNCTION CALLED SECOND
        * IT TAKES A DATA OBJECT
        * A STRING NAME OF DATA
        * AND A NUMBER Z AS INPUT
        * AND RETURNS A NUMBER
        **/
        function second(first, result, z) {
            if (result.localeCompare("institution") == 0) {
                yLabel = institution;
                return first[institution[z]][role][fs]
            }
            if (result.localeCompare("staff") == 0) {
                yLabel = faculty;
                return first[faculty[z]][fs]
            }
            if (result.localeCompare("fields") == 0) {
                yLabel = fields_names;
                return first[fields[z]]
            }
        }






        /**
        * THIS IS A FUNCTION CALLED SURVIVEDLEGEND
        * IT DRAWS THE GRAPH LENGEND
        **/
        function survivedLegend() {
            
            // stroke
            s = d3.scaleOrdinal()
                .domain(yLabel)
                .range(["#e31a1c","#1f78b4"]);

            //console.log("I'm trying to show the survived legend", s.domain())

            group = d3.select('svg').append("g")
            .attr("class","legend-group");

            var label = getResult()
            //console.log("LABELSS", label)

            group.append("text")
                .text(label[1])
                .attr('x', function(d){ return (origin[0]+400) + 'px'})
                .attr('y', function(d){ return (159) + 'px' })
                .style("font-weight","bold")
                .style("text-transform", "capitalize")
                .style("text-anchor","end");

            var legend = group.selectAll(".legend")
                .data(s.domain())
                .enter().append("g")
                .attr("class","legend")
                .attr("transform",function(d,i) {
                return "translate(0," + i * 20 + ")";
            });

            legend.append("rect")
                .attr('x', function(d){ return (origin[0]+400) + 'px'})
                .attr('y', function(d){ return (165) + 'px' })
                .attr("width",18)
                .attr("height",18)
                .style("fill", function (d) { return color(d)});

            legend.append("text")
                .attr('x', function(d){ return (origin[0]+400) + 'px'})
                .attr('y', function(d){ return (173) + 'px' })
                .attr("dy",".35em")
                .style("text-anchor","end")
                .text(function(d) { return d; });
        }






        /**
        * THIS IS A FUNCTION CALLED PROCESSDATA
        * THIS FUNCTION DRAWS THE SVG AND DECIDES APPEARANCE
        * PARAM data THE CUBES TO BE DRAWN
        * PARAM tt THE DURATION OF TRANSITIONS
        **/
        function processData(data, tt) {
            //console.log("Is this processed?")
            
            // ************************** GRID ***************************** //
            
            /* ----------- X AND Y AXES ----------- */
            var yScale3d = d3._3d()
                .shape('LINE_STRIP')
                .origin(origin)
                .rotateY(startAngle)
                .rotateX(-startAngle)
                .scale(scale*0.01);  // TJH added *0.01

            var xScale3d = d3._3d()
                .shape('LINE_STRIP')
                .origin(origin)
                .rotateY(startAngle)
                .rotateX(-startAngle)
                .scale(scale);

            
            /* -------------- y-Scale -------------- */
            var yScale = svg.selectAll('path.yScale').data(data[1]);
                yScale
                    .enter()
                    .append('path')
                    .attr('class', '_3d yScale')
                    .merge(yScale)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1)
                    .attr('d', yScale3d.draw);

                yScale.exit().remove();

            
            /* --------------- x-Scale --------------- */
            var xScale = svg.selectAll('path.xScale').data(data[2]);
                xScale
                    .enter()
                    .append('path')
                    .attr('class', '_3d yScale')
                    .merge(xScale)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1)
                    .attr('d', xScale3d.draw);

                xScale.exit().remove();

            
            /* -------------- y-Scale Text -------------- */
            var yText = svg.selectAll('text.yText').data(data[1][0]);
                yText
                    .enter()
                    .append('text')
                    .attr('class', '_3d yText')
                    .attr('dx', '.3em')
                    .merge(yText)
                    .each(function (d) {
                        d.centroid = { x: d.rotated.x, y: d.rotated.y, z: d.rotated.z };
                    })
                    .attr('x', function (d) { return d.projected.x; })
                    .attr('y', function (d) { return d.projected.y; })
                    .text(function (d, i) {
                        if( i < yLabel.length){
                            return yLabel[i];
                        }
                    });
                yText.exit().remove();

            
            /* ----------- x-Scale Text ----------- */
            var xText = svg.selectAll('text.xText').data(data[2][0]);
                xText
                    .enter()
                    .append('text')
                    .attr('class', '_3d xText')
                    .attr('dx', '.3em')
                    .merge(xText)
                    .each(function (d) {
                        d.centroid = { x: d.rotated.x, y: d.rotated.y, z: d.rotated.z };
                    })
                    .attr('x', function (d) { return d.projected.x; })
                    .attr('y', function (d) { return d.projected.y; })
                    .text(function (d, i) {
                        if ((i + 1) % yLabel.length == 0) {
                            return xLabel[(i + 1) / yLabel.length - 1];
                        }
                    });
                xText.exit().remove();

            
            // ************************** CUBES ***************************** //

            var cubes = cubesGroup.selectAll('g.cube').data(data[0], function (d) { return d.id });

            var ce = cubes
                .enter()
                .append('g')
                .attr('class', 'cube')
                .attr('fill', function (d) { //console.log("MY COLOR SHOULD BE", d.ycolor);
                                            return color(d.ycolor);
                                           })
                .attr('stroke', function (d) { return d3.color(color(d.ycolor)).darker(2);})
                .merge(cubes)
                .sort(cubes3D.sort)

                /** THIS IS THE INFO ON THE PREVIOUS TOOLTIP
                    .html('<div style="font-size: 2rem; font-weight: bold">'+ d.id +'</div>')
                    .style('left', (origin[0]-400) + 'px')
                    .style('top', (300) + 'px') ***/

            // ---------------------  NEW ON-CLICK OPTIONS --------------------- //

                .on('click', function (d) {

                    // IF NOTHING IS SELECTED
                    if (arraySize == 0) {
                        tempColor = this.style.fill;
                        // temp_colors[0] = tempColor;
                        // console.log("This cube color is selected", temp_colors[0]);
                        selected[0] = this
                        arraySize = 1;
                        //console.log("This cube is selected", selected);

                        //SELECT THE CURRENT CUBE
                        d3.select(this)
                            .style('fill', 'yellow')

                        //DISPLAY THE TEXT
                        draw_information(d, "visible");
                    }

                    // IF SELECTED AGAIN
                    else if(arraySize == 1 && Object.is(this, selected[0])){

                        //REMOVE THE TEXT OF THE TOOLTIP
                        draw_information(d, "hidden");

                        //AND RESTORE THE COLOR
                        d3.select(this)
                            .style('fill', tempColor)
                        arraySize = 0;
                        //console.log("This cube is selected again", selected[0]);
                    }

                    //IF ANOTHER CUBE IS SELECTED
                    else if(!Object.is(this, selected[0])){
                        tempColor = this.style.fill;
                        //console.log("another cube is selected", selected[0]);
                        var tempCube = selected[0]

                        //the text is hidden automatically

                        //AND RESTORE THE COLOR
                        d3.select(tempCube)
                        .style('fill', tempColor)

                        //SELECT THE CURRENT CUBE
                        selected[0] = this;
                        d3.select(this)
                            .style('fill', 'yellow')

                        //ADD NEW TEXT TO THE TOOLTIP
                        draw_information(d, "visible");

                    }

                })


            /* --------- FACES ---------*/

            var faces = cubes
                .merge(ce)
                .selectAll('path.face')
                .data(function(d){ return d.faces; }, function(d){ return d.face; });

            faces
                .enter()
                .append('path')
                .attr('class', 'face')
                .attr('fill-opacity', 0.95)
                .classed('_3d', true)
                .merge(faces)
                .transition().duration(tt)
                .attr('d', cubes3D.draw);

            faces.exit().remove();


            /** THIS IS THE NEW TOOLTIP THAT DRAWS INFO ABOUT EACH CUBE **/

            function draw_information(clicked_cube, visibility){
            
                var texts = svg2.selectAll('text').data(function(d){
                    //var _t = clicked_cube.faces.filter(function(d){
                    //    return clicked_cube.face === 'top';
                    //});
                    return [{height: clicked_cube.height}];
                });
                var label = getResult()
                //console.log("LABELSS", label[1])

                texts
                    .enter()
                    .append('text')
                    .attr('class', 'text')
                    .attr('dy', '-.40em')
                    .attr('text-anchor', 'middle')
                    .attr('font-family', 'sans-serif')
                    .attr('font-weight', 'bolder')
                    .attr("font-size", "1rem")
                    .attr('x', function(d){ return (origin[0]-400) + 'px' })
                    .attr('y', function(d){ return (10) })
                    .classed('_3d', true)
                    .merge(texts)
                    .transition().duration(2000000)
                    .attr('fill', 'black')
                    .attr('stroke', 'none')
                    .attr('x', function(d){ return (origin[0]-400) + 'px'})
                    .attr('y', function(d){ return (10) + 'px' })
                    .tween('text', function(d){
                        var that = d3.select(this);
                        //All the text that will be displayed
                        var height = Math.abs(clicked_cube.height)*10000;
                        //console.log(Math.abs(clicked_cube.height)*10000)
                        var height_text = "<tspan x='"+(origin[0]-400) +"' dy='1.2em'>" + "Jobs: " + height + "</tspan>"
                        var role_text = "<tspan x='"+(origin[0]-400) +"' dy='1.2em'>" + "Role: " + role + "</tspan>"
                        var fields_text = "<tspan x='"+(origin[0]-400) +"' dy='1.2em'>" + "Fields: " + fs + "</tspan>"
                        var x_text = "<tspan x='"+(origin[0]-400) +"' dy='1.2em'>" + label[0] + ": " +clicked_cube.xattr + "</tspan>"
                        var y_text = "<tspan x='"+(origin[0]-400) +"' dy='1.2em'>" + label[1] + ": " + clicked_cube.ycolor + "</tspan>"
                        var inst_text = "<tspan x='"+(origin[0]-400) +"' dy='1.2em'>" + "Institution" + ": " + inst + "</tspan>"
                        
                        if(label[0] == "fields" || label[1] == "fields" ){
                            fields_text = " "
                        }
                        if(label[0] == "institution" || label[1] == "institution" ){
                            inst_text = " "
                        }
                        if(label[0] == "staff" || label[1] == "staff" ){
                            role_text = " "
                        }
                        
                        return function(t){    //VARIABLES RETURNED FOR EACH CUBE
                            that.html(function (d) {
                                return y_text
                                    + x_text
                                    + fields_text
                                    + role_text
                                    +inst_text
                                    + height_text;
                            })
                            .attr("visibility", visibility) //CHANGE VISIBILITY
                            .attr("fill", "black") //COLOR OF THE TEXT
                            .attr('dy', '-.8em')
                        };
                    });
                    //console.log("tried to display the text")
                texts.exit().remove();
            }
            
            //console.log("exiting the svg")
            cubes.exit().remove(); //VERY IMPORTANT STEP

            /* --------- SORT TEXT & FACES ---------*/

            ce.selectAll('._3d').sort(d3._3d().sort);
            //console.log("The very last step")
        }






        /**
        * THIS IS A FUNCTION CALLED DRAGSTART
        * IT DETERMINES WHAT HAPPENS IN EVENT START
        **/
        function dragStart() {
            mx = d3.event.x;
            my = d3.event.y;
        }






        /**
        * THIS IS A FUNCTION CALLED DRAGGED
        * IT DETERMINES WHAT HAPPENS WHEN THE EVENT DRAG OCCURS
        **/
        function dragged() {
            mouseX = mouseX || 0; // A SHORTENED VERSION OF AN IF ELSE STATEMENT
            mouseY = mouseY || 0; // IF VARIABLE IS DEFINED USE MOUSEY ELSE USE 0
            beta = (d3.event.x - mx + mouseX) * Math.PI / 230;
            alpha = (d3.event.y - my + mouseY) * Math.PI / 230 * (-1);
            //processData(cubes3D.rotateY(beta + startAngle).rotateX(alpha - startAngle)(cubesData), 0);
            var data = [
                cubes3D.rotateY(beta + startAngle).rotateX(alpha - startAngle)(cubesData),
                yScale3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([yLine]),
                xScale3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([xLine]),
            ];
            processData(data, 0);
        }






        /**
        * THIS IS A FUNCTION CALLED DRAGEND
        * IT DETERMINES WHAT HAPPENS IN EVENT END
        **/
        function dragEnd() {
            mouseX = d3.event.x - mx + mouseX;
            mouseY = d3.event.y - my + mouseY;
        }







        /**
        * THIS IS A FUNCTION CALLED MAKECUBE
        * IT CREATES THE VERTICES OF A SINGLE CUBE
        * PARAMETERS X,Y,Z ON A COORDINATE PLANE
        * RETURNS A LIST OF VERTICES
        **/
        function makeCube(x, y, z) {
            return [
                { x: x - 1, y: y, z: z + 1 }, // FRONT TOP LEFT
                { x: x - 1, y: 0, z: z + 1 }, // FRONT BOTTOM LEFT
                { x: x + 1, y: 0, z: z + 1 }, // FRONT BOTTOM RIGHT
                { x: x + 1, y: y, z: z + 1 }, // FRONT TOP RIGHT
                { x: x - 1, y: y, z: z - 1 }, // BACK  TOP LEFT
                { x: x - 1, y: 0, z: z - 1 }, // BACK  BOTTOM LEFT
                { x: x + 1, y: 0, z: z - 1 }, // BACK  BOTTOM RIGHT
                { x: x + 1, y: y, z: z - 1 }, // BACK  TOP RIGHT
            ];
        }

        //d3.selectAll('button').on('click', init); // RERUNS INIT WITH BUTTON PRESS
