var jump_board = [
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
        {
            "piece_type": "REGULAR",
            "owner": 1,
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
        {
            "piece_type": "REGULAR",
            "owner": 2,
            "coordinates": {
                "row": 2,
                "col": 5
            }
        },
        null,
        {
            "piece_type": "REGULAR",
            "owner": 2,
            "coordinates": {
                "row": 2,
                "col": 7
            }
        }
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
        {
            "piece_type": "REGULAR",
            "owner": 2,
            "coordinates": {
                "row": 3,
                "col": 6
            }
        },
        null
    ],
    [
        null,
        {
            "piece_type": "REGULAR",
            "owner": 1,
            "coordinates": {
                "row": 4,
                "col": 1
            }
        },
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
        {
            "piece_type": "REGULAR",
            "owner": 1,
            "coordinates": {
                "row": 4,
                "col": 5
            }
        },
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
        {
            "piece_type": "REGULAR",
            "owner": 1,
            "coordinates": {
                "row": 5,
                "col": 3
            }
        },
        null,
        null,
        {
            "piece_type": "REGULAR",
            "owner": 2,
            "coordinates": {
                "row": 5,
                "col": 6
            }
        },
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


describe("Run tests", function() {
    describe("P1 Regular jump validation", function () {
        describe("Checks for valid jumps", function () {
            it("should return true for p1 valid jump 4,4 to 2,2", function () {
                var move = {"old_pos": {"row": 4, "col": 4}, "new_pos": {"row": 2, "col": 2}};
                expect(is_valid_jump(move, jump_board)).toBe(true);
            });

            it("should return false for p1 invalid jump (out of bounds)", function () {
                var move = {"old_pos": {"row": 4, "col": 1}, "new_pos": {"row": -1, "col": 2}};
                expect(is_valid_jump(move, jump_board)).toBe(false);
            });

            it("should return false for p1 invalid jump (jump own piece)", function () {
                var move = {"old_pos": {"row": 5, "col": 3}, "new_pos": {"row": 3, "col": 5}};
                expect(is_valid_jump(move, jump_board)).toBe(false);
            });

            it("should return false for p1 invalid jump (jump occupied space)", function () {
                var move = {"old_pos": {"row": 4, "col": 5}, "new_pos": {"row": 2, "col": 7}};
                expect(is_valid_jump(move, jump_board)).toBe(false);
            });

            it("should return false for p1 invalid jump (jump backwards)", function () {
                var move = {"old_pos": {"row": 4, "col": 7}, "new_pos": {"row": 5, "col": 6}};
                expect(is_valid_jump(move, jump_board)).toBe(false);
            });

            it("should return false for p1 invalid jump (jump too far)", function () {
                var move = {"old_pos": {"row": 4, "col": 4}, "new_pos": {"row": 1, "col": 1}};
                expect(is_valid_jump(move, jump_board)).toBe(false);
            });

        });
    });

    describe("P2 Regular jump validation", function () {
        describe("Checks for valid jumps", function () {
            it("should return true for p2 valid jump", function () {
                var move = {"old_pos": {"row": 3, "col": 3}, "new_pos": {"row": 5, "col": 5}};
                expect(is_valid_jump(move, jump_board)).toBe(true);
            });

            it("should return false for p2 invalid jump (out of bounds)", function () {
                var move = {"old_pos": {"row": 3, "col": 6}, "new_pos": {"row": 5, "col": 8}};
                expect(is_valid_jump(move, jump_board)).toBe(false);
            });

            it("should return false for p1 invalid jump (jump own piece)", function () {
                var move = {"old_pos": {"row": 2, "col": 4}, "new_pos": {"row": 4, "col": 2}};
                expect(is_valid_jump(move, jump_board)).toBe(false);
            });

            it("should return false for p1 invalid jump (jump occupied space)", function () {
                var move = {"old_pos": {"row": 2, "col": 7}, "new_pos": {"row": 4, "col": 5}};
                expect(is_valid_jump(move, jump_board)).toBe(false);
            });

            it("should return false for p1 invalid jump (jump backwards)", function () {
                var move = {"old_pos": {"row": 5, "col": 6}, "new_pos": {"row": 3, "col": 4}};
                expect(is_valid_jump(move, jump_board)).toBe(false);
            });

            it("should return false for p1 invalid jump (jump too far)", function () {
                var move = {"old_pos": {"row": 3, "col": 0}, "new_pos": {"row": 7, "col": 4}};
                expect(is_valid_jump(move, jump_board)).toBe(false);
            });

        });
    });
});