let body;
let canvas;
let context;
let direction_enum;
let command_queue;
let current_direction;
let game_speed;
let head;
let apple;
let gameOver = false;

// Need to be able to pause and update a score
// Need something to calculate board size and body part size

// Next let's get the apple logic working!
// Have an apple randomly spawn on the grid that changes position every time it's eaten
// (It can only spawn wherever the body isn't and it must also be within the grid)

// After apple logic is working, make the snow grow

// Finally, implement collision detection for a game over!
// (Collision with body or edges of grid)

window.onload = () => {

    body = document.getElementsByTagName("body")[0];
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    direction_enum = {
        "right": 1,
        "left": 2,
        "up": 3,
        "down": 4
    }
    command_queue = [];
    current_direction = direction_enum['right'];
    game_speed = .05;

    bodyRect = body.getBoundingClientRect();

    // canvas.setAttribute("width", bodyRect.width / 2);
    // canvas.setAttribute("height", (bodyRect.height / 2));

    body.addEventListener("keydown", (event) => {
        if(event.key == 'ArrowUp') {
           //current_direction = direction_enum["up"];
           command_queue.push(direction_enum["up"]);
        }
        if(event.key == 'ArrowDown') {
            //current_direction = direction_enum["down"];
            command_queue.push(direction_enum["down"]);
        }
        if(event.key == 'ArrowRight') {
            //current_direction = direction_enum["right"];
            // console.log("RIGHT PRESS");
            command_queue.push(direction_enum["right"]);
        }
        if(event.key == 'ArrowLeft') {
            //current_direction = direction_enum["left"];
            command_queue.push(direction_enum["left"]);
        }
    })

   // drawMovingRectangle(context, {x: 0, y: 0});
   buildSnakeBody(4, {x: 0, y: 0});
   updateApplePosition();
   gameLoop(context);

}

// async function drawMovingRectangle(context, startingPosition) {
async function gameLoop(context) {

    while(!gameOver) {
        
        // context.strokeRect(startingPosition.x, startingPosition.y, 20, 20);
        // startingPosition.x += 1;
        draw();
        await gameClock(game_speed, context, head);
        gameOver = checkCollisions();

    }

}

function gameClock(seconds, context, head_ref) {
    return new Promise((resolve, reject) => {
        setTimeout((context, head) => {
            update_snake_head_position(head_ref);
            update_snake_body();
            resolve();
        }, seconds * 1000);
    })
}

function update_snake_head_position(head_ref) {

    let recent_direction_change = command_queue.pop();

    // console.log(recent_direction_change);

    if(check_direction_change(recent_direction_change)) {

        current_direction = recent_direction_change ? recent_direction_change : current_direction;

    }

    head_ref.prev_x = head_ref.x;
    head_ref.prev_y = head_ref.y;

    switch(current_direction) {

        case direction_enum["up"]:
            head_ref.y -= 20;
            break;
        
        case direction_enum["down"]:
            head_ref.y += 20
            break;
        
        case direction_enum["left"]:
            head_ref.x -= 20
            break;
        
        case direction_enum["right"]:
            // console.log("right");
            head_ref.x += 20;
            break;

    }

}

function update_snake_body() {
    let current = head;
    while(current.next != undefined) {
        
        current.next.prev_x = current.next.x;
        current.next.prev_y = current.next.y;
        current.next.x = current.prev_x;
        current.next.y = current.prev_y;

        current = current.next;
    }

}

function check_direction_change(direction) {
    if(direction == direction_enum["up"] && current_direction != direction_enum["down"]) {
        return true;
    }
    if(direction == direction_enum["down"] && current_direction != direction_enum["up"]) {
        return true;
    }
    if(direction == direction_enum["right"] && current_direction != direction_enum["left"]) {
        return true;
    }
    if(direction == direction_enum["left"] && current_direction != direction_enum["right"]) {
        return true;
    }
    return false;
}

function buildSnakeBody(size, startingPosition) {

    head = {
        x: startingPosition.x, 
        y: startingPosition.y,
        prev_x: startingPosition.x,
        prev_y: startingPosition.y,
        next: undefined
    };

    let current = head;

    for(let i = 1; i < size; i++) {

        let bodyPart = {
            x: startingPosition.x, 
            y: startingPosition.y,
            prev_x: startingPosition.x,
            prev_y: startingPosition.y,
            next: undefined
        }

        current.next = bodyPart;

        current = bodyPart;
        
    }
}

function draw() {

    // Draws snake and apple

    context.reset();
    let current = head;
    context.fillStyle = "green";
    context.fillRect(current.x, current.y, 20, 20);
    while(current.next != undefined) {
        current = current.next;
        context.fillRect(current.x, current.y, 20, 20);
    }

    context.fillStyle = "red";

    context.fillRect(apple.x, apple.y, 20, 20);

}

function updateApplePosition() {
    apple = {}
    validPosition = false;

    while(!validPosition) {
        apple.x = getRandomInt(800);
        apple.y = getRandomInt(800);

        let current = head;

        validPosition = true;

        while(current.next != undefined) {

            if(current.x == apple.x && current.y == apple.y) {
                validPosition = false;
                break;
            }

            current = current.next;

        }

    }

}

function checkCollisions() {

    // First let's check if the snake has collided with itself or the edges of the canvas

    if(head.x > 800 || head.x < 0 || head.y > 800 || head.y < 0) {
        return true;
    }
    
    let current = head;

    while(current.next != undefined) {

        if(current.next.x == head.x && current.next.y == head.y) {
            return true;
        }

        current = current.next;

    }

    // Check if snake ate the apple (the head of snake and apple intersected with eachother)

    if(head.x == apple.x && head.y == apple.y) {
        updateApplePosition();
        growSnake(3);
    }

    return false;

}


// Not the best random integer solution, there has got to be a better way, this is functional for now...

function getRandomInt(max) {

    

    while(true) {

        randint = Math.floor(Math.random() * max);

        if(randint % 20 == 0) {
            return randint;
        }

    }

}

function growSnake(growthAmount) {

    let tail = head;

    while(tail.next != undefined) {
        
        tail = tail.next;

    }

    // Add to the snake

    for(let i = 0; i < growthAmount; i++) {

        tail.next = {
            x: tail.x,
            y: tail.y,
            prev_x: tail.prev_x,
            prev_y: tail.prev_y,
            next: undefined
        }

        tail = tail.next;

    }

}