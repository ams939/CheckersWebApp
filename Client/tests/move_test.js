//import { is_out_of_bounds } from '../Validator.js';

var coords = {"row": 0, "col": 0};
var coords2 = {"row": 8, "col": 8};

// test board
var board = [
    [
        {
            "piece_type": "REGULAR",
            "owner": 1,
            "coordinates": {
                "row": 2,
                "col": 4
            }
        },
        null,
        null,
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
        {
            "piece_type": "REGULAR",
            "owner": 2,
            "coordinates": {
                "row": 4,
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
            "piece_type": "REGULAR",
            "owner": 1,
            "coordinates": {
                "row": 4,
                "col": 2
            }
        },
        null,
        null,
        null,
        {
            "piece_type": "REGULAR",
            "owner": 2,
            "coordinates": {
                "row": 2,
                "col": 2
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
        {
            "piece_type": "REGULAR",
            "owner": 1,
            "coordinates": {
                "row": 4,
                "col": 4
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
        null,
        null,
        {
            "piece_type": "REGULAR",
            "owner": 1,
            "coordinates": {
                "row": 2,
                "col": 2
            }
        },
        null
    ],
    [
        null,
        null,
        {
            "piece_type": "REGULAR",
            "owner": 2,
            "coordinates": {
                "row": 4,
                "col": 2
            }
        },
        null,
        null,
        null,
        null,
        null
    ]
];
//var move = {"old_pos":{"row": "col":},"new_pos":{"row": "col":}};

describe("Run tests", function() {
    describe("P1 Regular move validation", function () {
        describe("Checks for valid moves", function () {
            it("should return false for valid coordinates", function () {
                expect(is_out_of_bounds(coords)).toBe(false);
                expect(is_out_of_bounds(coords2)).toBe(true);
            });

            it("should return true for p1 valid move 5,5 to 4,4", function () {
                var move = {"old_pos": {"row": 5, "col": 5}, "new_pos": {"row": 4, "col": 4}};
                expect(is_valid_move(move, board)).toBe(true);
            });

            it("should return true for p1 valid move 5,5 to 4,6", function () {
                var move = {"old_pos": {"row": 5, "col": 5}, "new_pos": {"row": 4, "col": 6}};
                expect(is_valid_move(move, board)).toBe(true);
            });

            it("should return false for p1 invalid regular move 5,5 to 6,4 (wrong dir)", function () {
                var move = {"old_pos": {"row": 5, "col": 5}, "new_pos": {"row": 6, "col": 4}};
                expect(is_valid_move(move, board)).toBe(false);
            });

            it("should return false for p1 invalid move 6,6 to 5,5 (slot occupied)", function () {
                var move = {"old_pos": {"row": 5, "col": 5}, "new_pos": {"row": 6, "col": 4}};
                expect(is_valid_move(move, board)).toBe(false);
            });

            it("should return false for p1 invalid move 6,6 to 5,5 (out of bounds)", function () {
                var move = {"old_pos": {"row": 0, "col": 0}, "new_pos": {"row": 0, "col": -1}};
                expect(is_valid_move(move, board)).toBe(false);
            });

        });
    });

    describe("P2 Regular move validation", function () {
        describe("Checks for valid p2 moves", function () {

            it("should return true for p2 valid move 2,4 to 3,5", function () {
                var move = {"old_pos": {"row": 2, "col": 4}, "new_pos": {"row": 3, "col": 5}};
                expect(is_valid_move(move, board)).toBe(true);
            });

            it("should return true for p2 valid move 0,7 to 1,6", function () {
                var move = {"old_pos": {"row": 0, "col": 7}, "new_pos": {"row": 1, "col": 6}};
                expect(is_valid_move(move, board)).toBe(true);
            });

            it("should return false for p2 invalid regular move 2,4 to 1,5 (wrong dir)", function () {
                var move = {"old_pos": {"row": 2, "col": 4}, "new_pos": {"row": 1, "col": 5}};
                expect(is_valid_move(move, board)).toBe(false);
            });

            it("should return false for p2 invalid move 2,4 to 3,3 (slot occupied)", function () {
                var move = {"old_pos": {"row": 2, "col": 4}, "new_pos": {"row": 3, "col": 3}};
                expect(is_valid_move(move, board)).toBe(false);
            });

            it("should return false for p2 invalid move 7,2 to 8,1 (out of bounds)", function () {
                var move = {"old_pos": {"row": 7, "col": 2}, "new_pos": {"row": 8, "col": 1}};
                expect(is_valid_move(move, board)).toBe(false);
            });

        });
    });
});