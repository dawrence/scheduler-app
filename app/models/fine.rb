class Fine < ApplicationRecord

  belongs_to :student

  enum kind: %i[ general ]
end
