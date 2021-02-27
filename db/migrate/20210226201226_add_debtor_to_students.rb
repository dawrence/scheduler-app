class AddDebtorToStudents < ActiveRecord::Migration[5.2]
  def change
    add_column :students, :debtor, :boolean, default: false
  end
end
