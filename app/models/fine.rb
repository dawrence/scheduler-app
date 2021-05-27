class Fine < ApplicationRecord
  VALUE = 15000.0.freeze

  belongs_to :student

  enum kind: %i[ general ]


  scope :current, ->{where(paid: false)}
  scope :paid, ->{where(paid: true)}

  def pay
    self.update(paid: true)
    self.student.cash_flows.create(kind: 'pay', amount: VALUE, concept: 'Pagó de multa')
  end
end
