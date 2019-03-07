var validate_board = [
    [
        null,
        null,
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 1,
            "coordinates": {
                "row": 0,
                "col": 4
            }
        },
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 2,
            "coordinates": {
                "row": 1,
                "col": 3
            }
        },
        null,
        {
            "piece_type": "KING",
            "owner": 2,
            "coordinates": {
                "row": 1,
                "col": 5
            }
        },
        null,
        null
    ],
    [
        null,
        {
            "piece_type": "KING",
            "owner": 1,
            "coordinates": {
                "row": 2,
                "col": 1
            }
        },
        null,
        null,
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 2,
            "coordinates": {
                "row": 2,
                "col": 6
            }
        },
        null
    ],
    [
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 2,
            "coordinates": {
                "row": 3,
                "col": 2
            }
        },
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 1,
            "coordinates": {
                "row": 3,
                "col": 5
            }
        },
        null,
        null
    ],
    [
        null,
        {
            "piece_type": "KING",
            "owner": 1,
            "coordinates": {
                "row": 4,
                "col": 1
            }
        },
        null,
        {
            "piece_type": "KING",
            "owner": 1,
            "coordinates": {
                "row": 4,
                "col": 3
            }
        },
        {
            "piece_type": "KING",
            "owner": 2,
            "coordinates": {
                "row": 4,
                "col": 4
            }
        },
        null,
        {
            "piece_type": "KING",
            "owner": 2,
            "coordinates": {
                "row": 4,
                "col": 6
            }
        },
        null
    ],
    [
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 1,
            "coordinates": {
                "row": 5,
                "col": 2
            }
        },
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 1,
            "coordinates": {
                "row": 6,
                "col": 3
            }
        },
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        {
            "piece_type": "KING",
            "owner": 2,
            "coordinates": {
                "row": 7,
                "col": 4
            }
        },
        null,
        null,
        null
    ]
];

describe("Run validation tests", function() {
    describe("validate function test set 1, KING tests", function () {
        describe("Checks for valid move", function () {
            it("should return true, p1 valid jump", function () {
                var move1 = {"old_pos": {"row": 4, "col": 1}, "new_pos": {"row": 2, "col": 3}};
                expect(validate(move1, validate_board)).toBe(true);
            });

            it("should return true, p2 valid jump", function () {
                var move2 = {"old_pos": {"row": 4, "col": 6}, "new_pos": {"row": 2, "col": 4}};
                expect(validate(move2, validate_board)).toBe(true);
            });

            it("should return false, p1 invalid move (jump available)", function () {
                var move3 = {"old_pos": {"row": 2, "col": 1}, "new_pos": {"row": 1, "col": 0}};
                expect(validate(move3, validate_board)).toBe(false);
            });

            it("should return true, p1 valid jump", function () {
                var move4 = {"old_pos": {"row": 3, "col": 5}, "new_pos": {"row": 5, "col": 3}};
                expect(validate(move4, validate_board)).toBe(true);
            });

            it("should return true, p1 valid jump", function () {
                var move4 = {"old_pos": {"row": 3, "col": 5}, "new_pos": {"row": 5, "col": 3}};
                expect(validate(move4, validate_board)).toBe(true);
            });

            it("should return false for p1 invalid jump (jump occupied space)", function () {
                var move = {"old_pos": {"row": 4, "col": 3}, "new_pos": {"row": 2, "col": 1}};
                expect(validate(move, validate_board)).toBe(false);

            });

            it("should return false for p2 invalid move (jump available)", function () {
                var move = {"old_pos": {"row": 3, "col": 2}, "new_pos": {"row": 2, "col": 3}};
                expect(validate(move, validate_board)).toBe(false);

            });


            it("should return true for p2 valid jump", function () {
                var move = {"old_pos": {"row": 3, "col": 2}, "new_pos": {"row": 5, "col": 0}};
                expect(validate(move, validate_board)).toBe(true);

            });




        });
    });
});

// Board with one jump available
var validate_board2 = [
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        {
            "piece_type": "REGULAR",
            "owner": 2,
            "coordinates": {
                "row": 2,
                "col": 4
            }
        },
        null,
        null,
        null
    ],
    [
        {
            "piece_type": "REGULAR",
            "owner": 2,
            "coordinates": {
                "row": 3,
                "col": 0
            }
        },
        null,
        null,
        {
            "piece_type": "REGULAR",
            "owner": 2,
            "coordinates": {
                "row": 3,
                "col": 3
            }
        },
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        {
            "piece_type": "REGULAR",
            "owner": 1,
            "coordinates": {
                "row": 4,
                "col": 4
            }
        },
        null,
        null,
        {
            "piece_type": "REGULAR",
            "owner": 1,
            "coordinates": {
                "row": 4,
                "col": 7
            }
        }
    ],
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ]
];

describe("Run validation tests", function() {
    describe("validate function test set 2, REGULAR tests", function () {
        describe("Checks for valid move", function () {
            it("should return true, p1 valid jump", function () {
                var move1 = {"old_pos": {"row": 4, "col": 4}, "new_pos": {"row": 2, "col": 2}};
                expect(validate(move1, validate_board2)).toBe(true);
            });

            it("should return true, p2 valid jump", function () {
                var move2 = {"old_pos": {"row": 3, "col": 3}, "new_pos": {"row": 5, "col": 5}};
                expect(validate(move2, validate_board2)).toBe(true);
            });

            it("should return false, p1 invalid move (jump available)", function () {
                var move3 = {"old_pos": {"row": 4, "col": 7}, "new_pos": {"row": 3, "col": 6}};
                expect(validate(move3, validate_board2)).toBe(false);
            });



            it("should return false for p2 invalid move (jump available)", function () {
                var move4 = {"old_pos": {"row": 2, "col": 4}, "new_pos": {"row": 3, "col": 5}};
                expect(validate(move4, validate_board2)).toBe(false);

            });


        });
    });
});

// No jumps on board
var validate_board3 = [
    [
        {
            "piece_type": "REGULAR",
            "owner": 2,
            "coordinates": {
                "row": 0,
                "col": 0
            }
        },
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        {
            "piece_type": "REGULAR",
            "owner": 2,
            "coordinates": {
                "row": 1,
                "col": 1
            }
        },
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        {
            "piece_type": "REGULAR",
            "owner": 2,
            "coordinates": {
                "row": 2,
                "col": 2
            }
        },
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        {
            "piece_type": "REGULAR",
            "owner": 1,
            "coordinates": {
                "row": 6,
                "col": 2
            }
        },
        null,
        null,
        null,
        null,
        null
    ],
    [
        null,
        null,
        null,
        {
            "piece_type": "REGULAR",
            "owner": 1,
            "coordinates": {
                "row": 7,
                "col": 3
            }
        },
        null,
        null,
        null,
        null
    ]
];

describe("Run validation tests", function() {
    describe("validate function test set 3, REGULAR tests", function () {
        describe("Checks for valid move", function () {
            it("should return true, p1 valid move", function () {
                var move1 = {"old_pos": {"row": 6, "col": 2}, "new_pos": {"row": 5, "col": 1}};
                expect(validate(move1, validate_board3)).toBe(true);
            });

            it("should return true, p2 valid move", function () {
                var move2 = {"old_pos": {"row": 2, "col": 2}, "new_pos": {"row": 3, "col": 3}};
                expect(validate(move2, validate_board3)).toBe(true);
            });

            it("should return false, p1 invalid move (space occupied)", function () {
                var move3 = {"old_pos": {"row": 7, "col": 3}, "new_pos": {"row": 6, "col": 2}};
                expect(validate(move3, validate_board3)).toBe(false);
            });

            it("should return false, p1 invalid move (wrong dir)", function () {
                var move3 = {"old_pos": {"row": 6, "col": 2}, "new_pos": {"row": 7, "col": 1}};
                expect(validate(move3, validate_board3)).toBe(false);
            });



            it("should return false for p2 invalid move (out of bounds)", function () {
                var move4 = {"old_pos": {"row": 0, "col": 0}, "new_pos": {"row": -1, "col": 1}};
                expect(validate(move4, validate_board3)).toBe(false);

            });


        });
    });
});

