class Fine < ApplicationRecord

  belongs_to :student

  enum kind: %i[ general ]


  scope :current, ->{where(paid: false)}
  scope :paid, ->{where(paid: true)}

  def pay
    self.update(paid: true)
  end
end
